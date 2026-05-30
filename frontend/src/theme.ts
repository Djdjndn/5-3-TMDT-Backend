import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',
      dark: '#1D4ED8',
      light: '#DBEAFE',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F97316',
      dark: '#EA580C',
      light: '#FFEDD5',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontSize: '48px', fontWeight: 700, letterSpacing: 0 },
    h2: { fontSize: '36px', fontWeight: 700, letterSpacing: 0 },
    h3: { fontSize: '24px', fontWeight: 600, letterSpacing: 0 },
    h4: { fontWeight: 700, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 600, letterSpacing: 0 },
    body1: { fontSize: '16px', lineHeight: 1.6 },
    body2: { fontSize: '14px', lineHeight: 1.5 },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: 0,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F8FAFC',
        },
        a: {
          color: 'inherit',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 0 #E2E8F0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 12,
          boxShadow: 'none',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.18)',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.22)',
          },
        },
        outlined: {
          borderColor: '#E2E8F0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          '& fieldset': {
            borderColor: '#E2E8F0',
          },
          '&:hover fieldset': {
            borderColor: '#CBD5E1',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#2563EB',
            borderWidth: 1,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
  },
});

export default theme;
