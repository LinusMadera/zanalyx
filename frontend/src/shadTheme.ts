import { createTheme } from '@mui/material';
import { amber, common, green, grey, lightBlue, red } from '@mui/material/colors';
import { shadThemeShadows } from './shadows';

const bodyBackground = 'rgba(0, 0, 0, 0.3)';
const glassBackground = 'rgba(255, 255, 255, 0.15)';
const glassHoverBackground = 'rgba(255, 255, 255, 0.25)';

export const shadTheme = (mode: 'light' | 'dark') => {
  const isDarkMode = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        dark: isDarkMode ? grey['200'] : common['black'],
        main: isDarkMode ? common['white'] : grey['900'],
        light: isDarkMode ? grey['800'] : grey['100'],
      },
      secondary: {
        main: isDarkMode ? grey['100'] : grey['800'],
      },
      success: {
        main: green['900'],
      },
      error: {
        main: red['900'],
      },
      info: {
        main: lightBlue['900'],
      },
      warning: {
        main: amber['900'],
      },
      divider: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      background: {
        default: 'transparent',
        paper: glassBackground,
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    typography: {
      fontSize: 14,
      htmlFontSize: 18,
      fontFamily: [
        'Anaheim',
        'Noto Sans',
        '"Source Sans Pro"',
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      fontWeightMedium: 600,
      fontWeightBold: 700,
      h1: {
        fontSize: '3.75rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '3rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '2.125rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shadows: shadThemeShadows,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            colorScheme: isDarkMode ? 'dark' : 'light',
          },
          html: {
            minHeight: '100%',
          },
          body: {
            minHeight: '100%',
            backgroundColor: bodyBackground,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top right',
            backgroundSize: '100%',
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiListItemButton: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: glassBackground,
            backdropFilter: 'blur(5px)',
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            boxShadow: 'none',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backgroundColor: glassBackground,
            backdropFilter: 'blur(5px)',
            '&:hover': {
              backgroundColor: glassHoverBackground,
            },
          },
          outlined: {
            borderWidth: '1px',
          },
          sizeSmall: {
            padding: '4px 12px',
          },
          sizeMedium: {
            padding: '6px 16px',
          },
          sizeLarge: {
            padding: '8px 22px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            backgroundColor: glassBackground,
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: glassBackground,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: glassBackground,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: glassBackground,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8,
          },
        },
      },
    },
  });
};