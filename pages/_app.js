import '../styles/globals.scss'
import {
	GeistProvider,
	CssBaseline,
	useTheme
} from '@geist-ui/react'
import NextNProgress from 'nextjs-progressbar';
import React from "react";
import { FilterContextProvider } from '../components/FilterContext';

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
    <GeistProvider theme={{
		type: themeType,
		palette: {
			foreground: "#007577"
		}
	  }}>
		<FilterContextProvider>
		  	<CssBaseline />
			<Component {...pageProps} />
			<NextNProgress color="var(--text-color)" />
		</FilterContextProvider>
	</GeistProvider>
  )
}
export default MyApp

// export function reportWebVitals({
// 	id,
// 	name,
// 	label,
// 	value
// }) {
// 	// Use `window.gtag` if you initialized Google Analytics as this example:
// 	// https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
// 	window.gtag('event', name, {
// 		event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
// 		value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
// 		event_label: id, // id unique to current page load
// 		non_interaction: true, // avoids affecting bounce rate.
// 	})
// }