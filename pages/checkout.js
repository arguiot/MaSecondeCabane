import { Button, Page, Row, Text } from "@geist-ui/react"
import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import { CheckCircle, AlertTriangle } from '@geist-ui/react-icons'
import { withRouter } from "next/router"
import Link from "next/link"
import Locales from "../locales/Checkout"
import React from "react";
import getConfig from "../lib/config"

export async function getStaticProps({ locale }) {
    // Locales
	const locales = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][locale.split("-")[0]]
    ]))
    // Config
    const config = await getConfig()
    return {
        props: {
            t: locales,
            config
        }
    }
}

function Checkout({ router, t }) {
    const [success, setSuccess] = React.useState(true)
    React.useEffect(() => {
        const handleRoute = () => {
            const params = new URLSearchParams(window.location.search)
            const s = params.get("success") == "true"
            setSuccess(s)
            if (s == true) {
                localStorage.clear("cart") // Delete all the cart items
            }
        }

        router.events.on('routeChangeComplete', handleRoute)

        handleRoute()

        return () => {
            router.events.off('routeChangeComplete', handleRoute)
        }
    }, [])

    const succeeded = <Page>
        <Row justify="center">
            <CheckCircle size={96} />
        </Row>
        <Text h1 align="center">{ t.thanks }</Text>
        <Text h2 align="center">{ t.receive }</Text>
    </Page>

    const oups = <Page>
        <Row justify="center">
            <AlertTriangle size={96} />
        </Row>
        <Text h1 align="center">{ t.oups }</Text>
        <Text h2 align="center">{ t.problem }</Text>
        <Row justify="center">
            <Link href="/">
                <Button type="secondary">{ t.back }</Button>
            </Link>
        </Row>
        
    </Page>
    return <>
	<Head>
		<title>Ma Seconde Cabane - Checkout</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
        { success? succeeded : oups }
    <Footer />
    </>
}

export default withRouter(Checkout)