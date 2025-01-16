export type ThemeMode = 'default' | 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  border: string;
  hover: string;
  active: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
}

export interface ThemeConfig {
  mode: ThemeMode;
  colors: ThemeColors;
} 