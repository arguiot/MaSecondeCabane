import { Button, Page, Row, Text } from "@geist-ui/react"
import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import { CheckCircle, AlertTriangle } from '@geist-ui/react-icons'
import { withRouter } from "next/router"
import Link from "next/link"

function Checkout({ router }) {
    const [success, setSuccess] = React.useState(true)
    React.useEffect(() => {
        localStorage.clear("cart") // Delete all the cart items

        const handleRoute = () => {
            const params = new URLSearchParams(window.location.search)
            setSuccess(params.get("success") == "true")
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
        <Text h1 align="center">Merci!</Text>
        <Text h2 align="center">Vous recevrez votre commande d'ici peu.</Text>
    </Page>

    const oups = <Page>
        <Row justify="center">
            <AlertTriangle size={96} />
        </Row>
        <Text h1 align="center">Oups!</Text>
        <Text h2 align="center">Un problème est survenu! Réessayez, vous aurez peut-être plus de chance.</Text>
        <Row justify="center">
            <Link href="/">
                <Button type="secondary">Retour à la case départ</Button>
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