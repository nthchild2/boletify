export type TextInputKeyboardType = 'default' | 'email-address' | 'numeric';
export type TextInputAutoCapitalize = 'none' | 'sentences' | 'words' | 'characters';

export interface TextInputProps {
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  className?: string;
  testID?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputKeyboardType;
  autoCapitalize?: TextInputAutoCapitalize;
}
