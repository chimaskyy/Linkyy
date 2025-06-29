import CryptoJS from 'crypto-js';

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export const defaultPasswordOptions: PasswordOptions = {
  length: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
};

export function generatePassword(options: PasswordOptions): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let availableChars = '';

  if (options.includeUppercase) availableChars += uppercaseChars;
  if (options.includeLowercase) availableChars += lowercaseChars;
  if (options.includeNumbers) availableChars += numberChars;
  if (options.includeSymbols) availableChars += symbolChars;

  if (availableChars === '') availableChars = lowercaseChars;

  let password = '';
  const charactersLength = availableChars.length;

  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    password += availableChars.charAt(randomIndex);
  }

  return password;
}

export function encryptPassword(password: string, userId: string): string {
  return CryptoJS.AES.encrypt(password, userId).toString();
}

export function decryptPassword(encryptedPassword: string, userId: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, userId);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function calculatePasswordStrength(password: string): number {
  let strength = 0;

  strength += Math.min(password.length * 4, 40);

  if (/[A-Z]/.test(password)) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 15;

  return Math.min(strength, 100);
}