import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface PaletteColor {
    '50'?: string
    '100'?: string
    '200'?: string
    '300'?: string
    '400'?: string
    '500'?: string
    '600'?: string
    '700'?: string
    '800'?: string
    '900'?: string
  }

  interface SimplePaletteColorOptions {}
}

export default createTheme({
  palette: {
    primary: {
      'main': '#7071E8',
      '50': '#ebebfc',
      '100': '#cdcdf7',
      '200': '#abadf2',
      '300': '#898ced',
      '400': '#7070e8',
      '500': '#5954e1',
      '600': '#544bd6',
      '700': '#4b3fc9',
      '800': '#4434bd',
      '900': '#391da6',
    },
    secondary: {
      'main': '#FF644A',
      '50': '#ffedee',
      '100': '#ffd2d3',
      '200': '#ffa39a',
      '300': '#fa8072',
      '400': '#ff644a',
      '500': '#ff582a',
      '600': '#fc502d',
      '700': '#e94527',
      '800': '#dc3f20',
      '900': '#cc3512',
    },
  },
})
