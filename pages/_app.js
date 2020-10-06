import '../styles/globals.scss'
import {
	GeistProvider,
	CssBaseline,
	useTheme
} from '@geist-ui/react'
import NextNProgress from 'nextjs-progressbar';
import {
	Provider
} from 'next-auth/client'

function MyApp({
	Component,
	pageProps
}) {
	const [themeType, setThemeType] = React.useState('light')
	React.useEffect(() => {
		const md = window.matchMedia('(prefers-color-scheme: dark)')
		setThemeType(lastThemeType => (md.matches ? 'dark' : 'light'))

		const handler = event => {
			setThemeType(lastThemeType => (event.matches ? 'dark' : 'light'))
		}

		try {
			// Chrome & Firefox
			md.addEventListener('change', handler);
		} catch (e1) {
			try {
				// Safari
				md.addListener(handler);
			} catch (e2) {
				console.error(e2);
			}
		}
	}, [])

	const theme = useTheme()

  return (
    <Provider session={pageProps.session}>
      <GeistProvider theme={{
		  type: themeType,
		  palette: {
			  foreground: "#007577"
		  }
		}}>
        <CssBaseline />
        <Component {...pageProps} />
        <NextNProgress color="var(--text-color)" />
      </GeistProvider>
    </Provider>
  )
}
export default MyApp