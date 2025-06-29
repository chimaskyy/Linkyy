import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../contexts/ThemeContext';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
}) => {
  const {colors} = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const containerStyle: ViewStyle = {
    marginBottom: 16,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    borderWidth: 1,
    borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: multiline ? 12 : 0,
    minHeight: multiline ? numberOfLines * 20 + 24 : 48,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: multiline ? 0 : 12,
    textAlignVertical: multiline ? 'top' : 'center',
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  };

  const iconStyle = {
    marginHorizontal: 8,
  };

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setShowPassword(!showPassword);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIconName = () => {
    if (secureTextEntry) {
      return showPassword ? 'visibility-off' : 'visibility';
    }
    return rightIcon || '';
  };

  return (
    <View style={[containerStyle, style]}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View style={inputContainerStyle}>
        {leftIcon && (
          <Icon name={leftIcon} size={20} color={colors.textSecondary} style={iconStyle} />
        )}
        <TextInput
          style={[textInputStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity onPress={handleRightIconPress} style={iconStyle}>
            <Icon
              name={getRightIconName()}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};

export default Input;