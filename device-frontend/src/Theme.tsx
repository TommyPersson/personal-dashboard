
// Augment the palette to include an ochre color
import { createTheme } from "@mui/material"
import { experimental_extendTheme as extendTheme } from "@mui/material/styles"

declare module '@mui/material/styles' {
  interface Palette {
    ochre: Palette['primary'];
  }

  interface PaletteOptions {
    ochre?: PaletteOptions['primary'];
  }
}

// Update the Button's color options to include an ochre option
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    ochre: true;
  }
}


export const theme = createTheme({
  palette: {
    ochre: {
      main: "#E3D026",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#242105",
    },
  },
  components: {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
})

export const cssVarsTheme = extendTheme({
}, theme)


export const cssVarsDarkTheme = extendTheme({
}, darkTheme)