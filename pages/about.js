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
        <Text h4>
            { t.secondeLife }
        </Text>
        <Text p align="justify">
            { t.highQuality }
        </Text>
        <Text h4>{ t.howItWorks }</Text>
        <Text p align="justify">
            { t.selection }
        </Text>
        <Text p>
            { t.discover }
        </Text>
        <Text h5>{ t.shopping }</Text>
    </Page>
    <Footer />
    </>
}

import Locales from "../locales/About"

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