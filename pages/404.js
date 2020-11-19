import { Image, Page, Spacer, Text } from "@geist-ui/react"
import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"

export default function Custom404({ t }) {
    return <>
	<Head>
		<title>Ma Seconde Cabane - { t.error }</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page style={{ fontFamily: "var(--fancyFont)" }}>
        <Image.Browser url="https://masecondecabane.com">
            <Image width={540} height={246} src="/img/404.svg" />
        </Image.Browser>
        <Spacer y={.8} />
        <Text h1 align="center">{ t.lost }</Text>
        <Text h2 align="center">{ t.notFound }</Text>
        <Spacer y={.8} />
        <Text p align="justify">{ t.goBack }</Text>
    </Page>
    <Footer />
    </>
}

import Locales from "../locales/404"

export async function getStaticProps({ locale }) {
    // Locales
	const locales = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][locale.split("-")[0]]
    ]))
    return {
        props: {
            t: locales
        }
    }
}