'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useConfig } from '@/hooks/useConfig';
import { ReactNode } from 'react';

export function DynamicThemeProvider({ children }: { children: ReactNode }) {
  const { config, loading } = useConfig();
  
  const theme = createTheme({
    palette: {
      primary: {
        main: config?.theme?.primaryColor || '#1976d2'
      },
      secondary: {
        main: config?.theme?.secondaryColor || '#dc004e'
      },
      background: {
        default: config?.theme?.backgroundColor || '#ffffff'
      }
    },
    typography: {
      fontFamily: config?.theme?.fontFamily || 'Inter, sans-serif',
      h1: {
        fontSize: config?.theme?.headingSize || '2.5rem'
      }
    },
    shape: {
      borderRadius: config?.theme?.borderRadius || 8
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: config?.theme?.buttonBorderRadius || 8,
            textTransform: config?.theme?.buttonTextTransform || 'none',
            fontWeight: 600,
            padding: '12px 24px',
            fontSize: '1rem'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: config?.theme?.borderRadius || 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)'
            }
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            color: '#333'
          }
        }
      }
    }
  });
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {config?.theme?.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: config.theme.customCSS }} />
      )}
      {children}
    </ThemeProvider>
  );
}
