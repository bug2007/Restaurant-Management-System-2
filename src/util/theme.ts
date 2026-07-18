import { createTheme } from '@mui/material'

export const theme = createTheme({
    palette: {
        primary: {
            main: '#E17006',
            light: '#f3d9c1'
        }
    },
    typography: {
        fontFamily: '"Nunito", sans-serif',
    },
    mixins: {
        toolbar: {
            minHeight: 64,
            
            '@media (min-width: 600px)': {
                minHeight: 76
            }
        }
    }
}) 