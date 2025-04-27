import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/theme';
import { Button } from './Button';
import { translations } from '@/constants/translations';

const { height } = Dimensions.get('window');

interface EditProfileModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave: (value: string) => void;
  initialValue: string;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  label?: string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  title,
  onClose,
  onSave,
  initialValue,
  placeholder,
  multiline = false,
  maxLength,
  keyboardType = 'default',
  label
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<TextInput>(null);
  
  const handleSave = () => {
    onSave(value);
    onClose();
  };
  
  const handleCancel = () => {
    setValue(initialValue); // Reset to initial value
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{title}</Text>
                <Button
                  title={translations.save}
                  onPress={handleSave}
                  variant="text"
                  size="small"
                />
              </View>
              
              <ScrollView 
                style={styles.modalBody}
                contentContainerStyle={styles.modalBodyContent}
                keyboardShouldPersistTaps="handled"
              >
                {label && (
                  <Text style={styles.modalInputLabel}>{label}</Text>
                )}
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.modalTextInput,
                    multiline && styles.multilineInput
                  ]}
                  value={value}
                  onChangeText={setValue}
                  placeholder={placeholder}
                  placeholderTextColor={colors.textSecondary}
                  multiline={multiline}
                  numberOfLines={multiline ? 5 : 1}
                  maxLength={maxLength}
                  keyboardType={keyboardType}
                  autoFocus
                  onSubmitEditing={multiline ? undefined : handleSave}
                  blurOnSubmit={!multiline}
                  returnKeyType={multiline ? 'default' : 'done'}
                />
                
                {maxLength && (
                  <Text style={styles.characterCount}>
                    {value.length}/{maxLength}
                  </Text>
                )}
                
                <View style={styles.buttonContainer}>
                  <Button
                    title={translations.cancel}
                    onPress={handleCancel}
                    variant="outline"
                    style={styles.button}
                  />
                  <Button
                    title={translations.save}
                    onPress={handleSave}
                    style={styles.button}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  modalBody: {
    maxHeight: height * 0.6,
  },
  modalBodyContent: {
    padding: spacing.lg,
  },
  modalInputLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  modalTextInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    minHeight: 50,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});