export type ThemeMode = 'default' | 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  active: string;
  hover: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  gradient: {
    from: string;
    via: string;
    to: string;
  };
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

export interface ThemeContextType {
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
} 