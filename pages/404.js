import { Image, Page, Spacer, Text } from "@geist-ui/react"
import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"

export default function Custom404() {
    return <>
	<Head>
		<title>Ma Seconde Cabane - Erreur</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page style={{ fontFamily: "var(--fancyFont)" }}>
        <Image.Browser url="https://masecondecabane.com">
            <Image width={540} height={246} src="/img/404.svg" />
        </Image.Browser>
        <Spacer y={.8} />
        <Text h1 align="center">Oups! Vous vous êtes perdu!</Text>
        <Text h2 align="center">Désolés, la page que vous recherchez est introuvable.</Text>
        <Spacer y={.8} />
        <Text p align="justify">Vous pouvez retourner à la page d'accueil ou nous écrire si vous ne trouvez pas ce que vous recherchez. Nous sommes désolés que vous n'ayez pas trouvé ce que vous cherchiez. Si la page n'existe pas, c'est soit que nous avons fait une faute de frappe (oui, nous sommes humains aussi!), soit que le produit n'est plus disponible. Mais ne vous inquiétez pas, vous trouverez quelque chose d'équivalent sinon de meilleur sur notre catalogue!</Text>
    </Page>
    <Footer />
    </>
}