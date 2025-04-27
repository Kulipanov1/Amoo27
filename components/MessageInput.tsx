import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Image, Mic, Camera, Send, Plus, X, Smile } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { borderRadius, spacing, fontSize } from '@/constants/theme';
import { translations } from '@/constants/translations';

interface MessageInputProps {
  onSendMessage: (text: string, type?: 'text' | 'image' | 'voice' | 'video') => void;
  placeholder?: string;
}

// Common emojis
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
  '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',
  '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔',
  '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦',
  '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴',
  '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '❤️', '🧡',
  '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕',
  '💞', '💓', '💗', '💖', '💘', '💝', '💟', '👍', '👎', '👌',
  '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️',
  '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🙏',
  '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻',
  '👃', '🧠', '👀', '👁️', '👅', '👄', '💋', '🩸', '🔥', '✨',
  '🌟', '💫', '💬', '🗯️', '💭', '💤', '👋', '🎉', '🎊', '🎈'
];

const { width } = Dimensions.get('window');

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = translations.typeAMessage,
}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (showEmojiPicker) setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (isExpanded) setIsExpanded(false);
    Keyboard.dismiss();
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    if (Platform.OS !== 'web') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        {/* Expanded media options */}
        {isExpanded && (
          <View style={styles.expandedContainer}>
            <TouchableOpacity style={styles.mediaButton}>
              <Image size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaButton}>
              <Camera size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaButton}>
              <Mic size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeExpandButton}
              onPress={toggleExpand}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.plusButton}
            onPress={toggleExpand}
          >
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder={placeholder}
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={message.trim() ? handleSend : undefined}
              blurOnSubmit={false}
            />
            
            <TouchableOpacity 
              style={styles.emojiButton}
              onPress={toggleEmojiPicker}
            >
              <Smile size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? 'white' : colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Emoji Picker Modal */}
        <Modal
          visible={showEmojiPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEmojiPicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowEmojiPicker(false)}>
            <View style={styles.emojiModalOverlay}>
              <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                <View style={styles.emojiPickerContainer}>
                  <View style={styles.emojiPickerHeader}>
                    <Text style={styles.emojiPickerTitle}>{translations.selectEmoji}</Text>
                    <TouchableOpacity onPress={() => setShowEmojiPicker(false)}>
                      <X size={20} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  
                  <FlatList
                    data={emojis}
                    keyExtractor={(item, index) => `emoji-${index}`}
                    numColumns={8}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.emojiItem}
                        onPress={() => handleEmojiSelect(item)}
                      >
                        <Text style={styles.emoji}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.emojiList}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  expandedContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    justifyContent: 'space-around',
    position: 'relative',
  },
  mediaButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeExpandButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusButton: {
    padding: spacing.xs,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : spacing.xs,
    maxHeight: 100,
    color: colors.text,
  },
  emojiButton: {
    padding: spacing.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.inputBackground,
  },
  emojiModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  emojiPickerContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '50%',
  },
  emojiPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emojiPickerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  emojiList: {
    padding: spacing.sm,
  },
  emojiItem: {
    width: width / 8 - spacing.sm,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
});