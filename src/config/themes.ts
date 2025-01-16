import { ThemeConfig } from '../types/theme';

export const defaultTheme: ThemeConfig = {
  mode: 'default',
  colors: {
    primary: 'bg-sky-500',
    secondary: 'bg-sky-700',
    background: 'bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600',
    surface: 'bg-white/85',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      accent: 'text-sky-700'
    },
    border: 'border-gray-200',
    hover: 'hover:bg-sky-50',
    active: 'bg-sky-100',
    gradient: {
      from: 'from-sky-400',
      via: 'via-sky-500',
      to: 'to-sky-600'
    }
  }
};

export const lightTheme: ThemeConfig = {
  mode: 'light',
  colors: {
    primary: 'bg-cyan-500',
    secondary: 'bg-teal-600',
    background: 'bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-500',
    surface: 'bg-white',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      accent: 'text-teal-700'
    },
    border: 'border-gray-100',
    hover: 'hover:bg-cyan-50',
    active: 'bg-cyan-100',
    gradient: {
      from: 'from-cyan-400',
      via: 'via-cyan-500',
      to: 'to-teal-500'
    }
  }
};

export const darkTheme: ThemeConfig = {
  mode: 'dark',
  colors: {
    primary: 'bg-slate-800',
    secondary: 'bg-violet-500',
    background: 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950',
    surface: 'bg-slate-900/95',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      accent: 'text-violet-400'
    },
    border: 'border-slate-700',
    hover: 'hover:bg-slate-800',
    active: 'bg-slate-700',
    gradient: {
      from: 'from-slate-800',
      via: 'via-slate-900',
      to: 'to-slate-950'
    }
  }
}; 