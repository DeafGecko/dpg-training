import { useState } from 'react';
import { Colors } from '../constants/theme';

export type ThemeType = 'light' | 'dark' | 'highContrast';

export function useThemeManager() {
  const [theme, setTheme] = useState<ThemeType>('light');

  const colors = Colors[theme];

  return {
    theme,
    setTheme,
    colors
  };
}