import { Divider, Page, Row, Text } from "@geist-ui/react"
import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import { User } from '@geist-ui/react-icons'

export default function Privacy({ t }) {
    return <>
	<Head>
        <title>Ma Seconde Cabane - { t.privacy }</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page>
        <Row justify="center">
            <User size={96} />
        </Row>
        <Text h1 align="center">{ t.privacy }</Text>
        <Text h4 align="center">
            { t.subtitle }
        </Text>
        <Divider />
        <Text h3>{ t.collect }</Text>
        <Text p>
            { t.collectContentP1 }
            <br />
            { t.collectContentP2 }
            <br />
            { t.collectContentP3 }
        </Text>
        <Text h4>{ t.personalData }</Text>
        <ul>
            <li>
                <Text p>
                    { t.whenYouBuy }
                </Text>
            </li>
            <li>
                <Text p>
                    { t.whenYouVisit }
                </Text>
            </li>
        </ul>
        <Text h4>{ t.personalDataUsage }</Text>
        <Text p>
            { t.personalDataUsageSubtitle }
        </Text>
        <ul>
            <li>
                <Text p>
                    { t.newsletter }
                </Text>
            </li>
            <li>
                <Text p>
                    { t.improve }
                </Text>
            </li>
            <li>
                <Text p>
                    { t.internal }
                </Text>
            </li>
        </ul>
        <Text h4>{ t.cookies }</Text>
        <Text p>
            { t.cookiesP1 }
            <br/>
            { t.cookiesP2 }
        </Text>
    </Page>
    <Footer />
    </>
}

import Locales from "../locales/Privacy"
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