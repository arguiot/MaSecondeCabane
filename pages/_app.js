import '../styles/globals.scss'
import { GeistProvider, CssBaseline, useTheme } from '@geist-ui/react'
import NextNProgress from 'nextjs-progressbar';
import { Provider } from 'next-auth/client'

function MyApp({ Component, pageProps }) {
  const [themeType, setThemeType] = React.useState('light')
  React.useEffect(() => {
    const md = window.matchMedia('(prefers-color-scheme: dark)')
    setThemeType(lastThemeType => (md.matches ? 'dark' : 'light'))
    
    md.addEventListener('change', event => {
      setThemeType(lastThemeType => (event.matches ? 'dark' : 'light'))
    })
  })

  const { palette } = useTheme()

  return (
    <Provider session={pageProps.session}>
      <GeistProvider theme={{ type: themeType }}>
        <CssBaseline />
        <Component {...pageProps} />
        <NextNProgress color={ palette.foreground } />
      </GeistProvider>
    </Provider>
  )
}
export default MyApp