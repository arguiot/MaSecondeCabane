import { Avatar, Card, Col, Divider, Image, Page, Row, Spacer, Text } from "@geist-ui/react"
import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import styles from "../styles/About.module.scss"

export default function About({ t }) {
    return <>
	<Head>
		<title>Ma Seconde Cabane - { t.about }</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page style={{ fontFamily: "var(--fancyFont)" }}>
        <Row justify="center">
            {/* <Users size={96} /> */}
            <Image src="/logo.svg" height={96} style={{ width: "unset", objectFit: "unset" }}/>
        </Row>
        <Text h1 align="center" className={ styles.title }>{ t.about }</Text>
        <Divider />
        <Text h4>{ t.highQuality }</Text>
        <Text p align="justify">
            { t.highlightDesc }
        </Text>
        <Text h4>{ t.howItWorksTitle }</Text>
        <Text p align="justify">
            { t.howItWorksDesc }
        </Text>
        <Text h4>{ t.whyMaSecondeCabane }</Text>
        <ul className={ styles.list }>
            <li>{ t.secondeLife }</li>
            <li>{ t.reasonable }</li>
            <li>{ t.wayOfLife }</li>
            <li>{ t.ecological }</li>
        </ul>
        <Text h4>{ t.you }</Text>
        <Text p align="justify">
            { t.community } <a href="https://www.instagram.com/masecondecabane/" target="_blank">{ t.socialNetwork }</a>. { t.weNeedYou }
        </Text>
        <Text p align="justify">
            { t.visit }
        </Text>
        <Text h4 align="center" className={ styles.tagline }>
            { t.tagline }
        </Text>
    </Page>
    <Footer />
    </>
}

import Locales from "../locales/About"
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