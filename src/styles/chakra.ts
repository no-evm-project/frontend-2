import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'
import '@fontsource/space-grotesk'
import '@fontsource/poppins'
import '@fontsource/silkscreen'

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
      50: "#6117F3", 
      100: "#5218C7", 
      200: "#45199C", 
      300: "#371775", 
      400: "#2A1652", 
      500: "#1F113C", 
      600: "#1A0F30", 
      700: "#130B23", 
      800: "#0C001E", 
      900: "#060010", 
    },
    green2: '#18B05F',
    red2: '#C83232',
    primary: {
      50: '#fce7f9',
      100: '#f7b4eb',
      200: '#f390e2',
      300: '#ee5ed5',
      400: '#ea3ecd',
      500: '#e50ec0',
      600: '#d00daf',
      700: '#a30a88',
      800: '#7e086a',
      900: '#600651',
    },
    sell: {
      50: '#fde6f0',
      100: '#f8b0cf',
      200: '#f58ab8',
      300: '#f05497',
      400: '#ed3383',
      500: '#e90064',
      600: '#d4005b',
      700: '#a50047',
      800: '#800037',
      900: '#62002a',
    },
    buy: {
      50: '#e6fff7',
      100: '#b0ffe5',
      200: '#8affd8',
      300: '#54ffc7',
      400: '#33ffbc',
      500: '#00ffab',
      600: '#00e89c',
      700: '#00b579',
      800: '#008c5e',
      900: '#006b48',
    }
  },
  fonts,
  breakpoints,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('white', '#0E0020')(props),
        lineHeight: 'base',
      },
    }),
  },
  components: {
    Text: {
      baseStyle: {
        fontFamily: 'Poppins',
      }
    },
    Heading: {
      baseStyle: {
        fontFamily: 'Space Grotesk',
        // fontWeight: '700'
      }
    },
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
    Divider: {
      baseStyle: {
        borderColor: '#371775',
        border: '2px'
      }
    }
  }
})


export default theme
