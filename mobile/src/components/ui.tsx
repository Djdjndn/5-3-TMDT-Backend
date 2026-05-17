import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../config';

export const Screen: React.FC<{ children: React.ReactNode; padded?: boolean }> = ({ children, padded = true }) => (
  <View style={[styles.screen, padded && styles.padded]}>{children}</View>
);

export const Title: React.FC<{ children: React.ReactNode; subtitle?: string }> = ({ children, subtitle }) => (
  <View style={styles.titleWrap}>
    <Text style={styles.title}>{children}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

export const Input: React.FC<TextInputProps & { label?: string }> = ({ label, style, ...props }) => (
  <View style={styles.inputWrap}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      placeholderTextColor="#9CA3AF"
      style={[styles.input, style]}
      {...props}
    />
  </View>
);

export const Button: React.FC<{
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}> = ({ title, onPress, variant = 'primary', disabled, loading }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    disabled={disabled || loading}
    style={[styles.button, styles[`${variant}Button`], (disabled || loading) && styles.disabled]}
  >
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.buttonText, variant === 'secondary' && styles.secondaryText]}>{title}</Text>}
  </TouchableOpacity>
);

export const EmptyState: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <View style={styles.empty}>
    <Text style={styles.emptyTitle}>{title}</Text>
    {description ? <Text style={styles.emptyDesc}>{description}</Text> : null}
  </View>
);

export const LoadingState = () => (
  <View style={styles.center}>
    <ActivityIndicator color={colors.primary} size="large" />
  </View>
);

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  padded: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  titleWrap: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { marginTop: 6, color: colors.muted, fontSize: 15, lineHeight: 21 },
  inputWrap: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6 },
  input: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
  },
  button: {
    minHeight: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButton: { backgroundColor: colors.primary },
  secondaryButton: { backgroundColor: '#E5E7EB' },
  dangerButton: { backgroundColor: colors.danger },
  disabled: { opacity: 0.65 },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  secondaryText: { color: colors.text },
  empty: { padding: 22, alignItems: 'center' },
  emptyTitle: { fontWeight: '800', color: colors.text, fontSize: 17, textAlign: 'center' },
  emptyDesc: { color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
