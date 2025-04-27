import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  View, 
  StyleProp, 
  ViewStyle, 
  TextStyle,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  gradient = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[`${size}Button`],
      ...(fullWidth && styles.fullWidth),
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles.disabledButton,
        ...(variant !== 'ghost' && variant !== 'outline' && styles.disabledFill),
      };
    }

    switch (variant) {
      case 'primary':
        return { ...baseStyle, ...styles.primaryButton };
      case 'secondary':
        return { ...baseStyle, ...styles.secondaryButton };
      case 'tertiary':
        return { ...baseStyle, ...styles.tertiaryButton };
      case 'outline':
        return { ...baseStyle, ...styles.outlineButton };
      case 'ghost':
        return { ...baseStyle, ...styles.ghostButton };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...styles[`${size}Text`],
    };

    if (disabled) {
      return { ...baseStyle, ...styles.disabledText };
    }

    switch (variant) {
      case 'primary':
        return { ...baseStyle, ...styles.primaryText };
      case 'secondary':
        return { ...baseStyle, ...styles.secondaryText };
      case 'tertiary':
        return { ...baseStyle, ...styles.tertiaryText };
      case 'outline':
        return { ...baseStyle, ...styles.outlineText };
      case 'ghost':
        return { ...baseStyle, ...styles.ghostText };
      default:
        return baseStyle;
    }
  };

  const buttonContent = (
    <>
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={
            variant === 'outline' || variant === 'ghost' 
              ? colors.primary 
              : 'white'
          } 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </>
  );

  // Use correct gradient colors based on variant
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return gradients.primary as readonly [string, string, ...string[]];
      case 'secondary':
        return gradients.secondary as readonly [string, string, ...string[]];
      case 'tertiary':
        return gradients.tertiary as readonly [string, string, ...string[]];
      default:
        return gradients.primary as readonly [string, string, ...string[]];
    }
  };

  if (gradient && !disabled && variant !== 'outline' && variant !== 'ghost') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[styles.gradientWrapper, style]}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[getButtonStyle(), fullWidth && styles.fullWidth]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[getButtonStyle(), style]}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    flexDirection: 'row',
  },
  gradientWrapper: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  // Size variations
  smButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  mdButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  lgButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
  },
  smText: {
    fontSize: fontSize.xs,
  },
  mdText: {
    fontSize: fontSize.sm,
  },
  lgText: {
    fontSize: fontSize.md,
  },
  // Variant styles
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  tertiaryButton: {
    backgroundColor: colors.tertiary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  // Text colors
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: 'white',
  },
  tertiaryText: {
    color: 'white',
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  // Disabled state
  disabledButton: {
    opacity: 0.6,
  },
  disabledFill: {
    backgroundColor: colors.border,
  },
  disabledText: {
    color: colors.textSecondary,
  },
});