import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const glassStyles = {
  background: 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.7)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Outfit', system-ui, sans-serif`,
    body: `'Outfit', system-ui, sans-serif`,
  },
  colors: {
    brand: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    error: {
      500: '#ef4444',
    },
    success: {
      500: '#16a34a',
    }
  },
  styles: {
    global: {
      body: {
        bgGradient: 'linear(to-br, #e2e8f0, #f8fafc)',
        color: '#1e293b',
        minHeight: '100vh',
        backgroundAttachment: 'fixed',
      },
    },
  },
  layerStyles: {
    glass: {
      ...glassStyles,
      borderRadius: '24px',
      padding: '2.5rem',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      borderRadius: '16px',
      padding: '1.5rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      _hover: {
        background: 'rgba(255, 255, 255, 0.7)',
        transform: 'translateY(-6px)',
        borderColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 10px 20px rgba(31, 38, 135, 0.05)',
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '12px',
        fontWeight: '600',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          color: 'white',
          boxShadow: props.colorScheme === 'brand' ? '0 4px 14px rgba(99, 102, 241, 0.4)' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.700' : undefined,
            transform: 'translateY(-2px)',
            boxShadow: props.colorScheme === 'brand' ? '0 6px 20px rgba(99, 102, 241, 0.6)' : undefined,
          },
        }),
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: '12px',
        }
      },
      variants: {
        glass: {
          field: {
            background: 'rgba(255, 255, 255, 0.6)',
            border: '2px solid rgba(255, 255, 255, 0.7)',
            color: '#1e293b',
            _focus: {
              borderColor: 'brand.600',
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)',
            },
            _placeholder: {
              color: 'rgba(0, 0, 0, 0.4)',
            }
          }
        }
      },
      defaultProps: {
        variant: 'glass',
      }
    }
  },
});

export default theme;
