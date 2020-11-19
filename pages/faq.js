import { Avatar, Card, Col, Collapse, Divider, Image, Link, Page, Row, Spacer, Text } from "@geist-ui/react"
import { QuestionCircle } from '@geist-ui/react-icons'

import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import NextLink from "next/link"
import styles from "../styles/FAQ.module.scss"

export default function Faq({ t }) {
    return <>
	<Head>
		<title>Ma Seconde Cabane - { t.faq }</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page className={ styles.noTitleFancy }>
        <Row justify="center">
           <QuestionCircle size={96} />
        </Row>
        <Text h1 align="center">{ t.questions }</Text>
        <Spacer y={3} />
        <Text h3 style={{ fontFamily: "Quicksand" }}>{ t.buy }</Text>
        <Collapse.Group className={ styles.collapse }>
            <Collapse title={ t.questionsTitle }>
                { t.questionsP1 } <Link href="mailto:contact@masecondecabane.com" color>contact@masecondecabane.com</Link>. { t.questionsP2 }
            </Collapse>
            <Collapse title={ t.paymentTitle }>
                { t.paymentContent }
            </Collapse>
            <Collapse title={ t.whenArrive }>
                { t.whenArriveContent }
            </Collapse>
            <Collapse title={ t.controlledTitle }>
                { t.controlledContent }
            </Collapse>
        </Collapse.Group>
        <Spacer y={3} />
        <Text h3 style={{ fontFamily: "Quicksand" }}>{ t.sell }</Text>
        <Collapse.Group className={ styles.collapse }>
            <Collapse title={ t.whichItems }>
                { t.weSellP1 } <Link href="mailto:contact@masecondecabane.com" color>contact@masecondecabane.com</Link>{ t.weSellP2 } <NextLink href="/product/sell"><Link color>{ t.sellPage }</Link></NextLink>.
            </Collapse>
            <Collapse title={ t.howToSell }>
                { t.howToSellP1 } <NextLink href="/product/sell"><Link color>{ t.here }</Link></NextLink>. { t.howToSellP2 }
            </Collapse>
            <Collapse title={ t.whenWillIBePayed }>
                { t.whenWillIBePayedContent }
            </Collapse>
            <Collapse title={ t.howWillIBePayed }>
                { t.howWillIBePayedContent }
            </Collapse>
        </Collapse.Group>
    </Page>
    <Footer />
    </>
}

import Locales from "../locales/FAQ"

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