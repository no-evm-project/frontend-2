import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = {
  xs: '100px',
  sm: '425px',
  md: '1100px',
  lg: '1440px',
  xl: '1600px',
}

const config: ThemeConfig = {
  useSystemColorMode: false,
	initialColorMode: 'dark',
};

const theme = extendTheme({
  config: config,
  semanticTokens: {
    radii: {
      button: '12px',
    },
  },
  colors: {
    black: '#000',
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      1000: '#161616',
      1100: '#111111'
    },
    background: {
      50: "#E8E7EA", 
      100: "#D0CFD3", 
      200: "#A19EA8", 
      300: "#726E7C", 
      400: "#433D51", 
      500: "#140D25", 
      600: "#0F0A1C", 
      700: "#0A0713", 
      800: "#050309", 
      900: "#020104", 
    },
    green2: '#18B05F',
    red2: '#C83232',
    primary: {
      50: '#F60DC9',
      100: '#F60DC9',
      200: '#F60DC9',
      300: '#F60DC9',
      400: '#F60DC9',
      500: '#F60DC9',
      600: '#F60DC9',
      700: '#F60DC9',
      800: '#F60DC9',
      900: '#F60DC9',
    },
    background1: '#0E0020',
    background2: '#130B25',
  },
  fonts,
  breakpoints,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        fontFamily: 'body',
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('white', '#0E0020')(props),
        lineHeight: 'base',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '0px'
      }
    },
    Input: {
      baseStyle: {
        borderRadius: '2px'
      }
    },
    NumberInput: {
      baseStyle: {
        borderRadius: '0px',
      }
    },
    NumberInputField: {
      baseStyle: {
        borderRadius: '0px',
      }
    },
    InputGroup: {
      baseStyle: {
        borderRadius: '0px'
      }
    },
    InputLeftElement: {
      baseStyle: {
        borderRadius: '0px'
      }
    },
  }
})


export default theme
