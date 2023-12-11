import { Collapse, Divider, Image, Link, Page, Row, Spacer, Text } from "@geist-ui/react"

import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import NextLink from "next/link"
import styles from "../styles/FAQ.module.scss"

export default function Faq({ t }) {
    return <>
        <Head>
            <title>Ma Seconde Cabane - {t.faq}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <Page className={styles.noTitleFancy}>
            <Row justify="center">
                {/* <Users size={96} /> */}
                <Image src="/logo.svg" height={96} style={{ width: "unset", objectFit: "unset" }} />
            </Row>
            <Text h1 align="center" className={styles.title}>{t.questions}</Text>
            <Divider />
            <Spacer y={3} />
            <Text h3 style={{ fontFamily: "Quicksand" }}>{t.buy}</Text>
            <Collapse.Group className={styles.collapse}>
                <Collapse title={t.questionsTitle}>
                    {t.questionsP1} <Link href="mailto:contact@masecondecabane.com" color>contact@masecondecabane.com</Link>.
                    <br />
                    {t.questionsP2}
                </Collapse>
                <Collapse title={t.controlledTitle}>
                    {t.controlledContent}<br />
                    {t.weDefine}
                    <ul className={styles.list}>
                        <li>{t.goodConditions}</li>
                        <li>{t.excellentConditions}</li>
                        <li>{t.newWithLabel}</li>
                    </ul>
                </Collapse>
                <Collapse title={t.paymentTitle}>
                    {t.paymentContent}
                </Collapse>
                <Collapse title={t.whenArrive}>
                    {t.whenArriveContent}
                </Collapse>
            </Collapse.Group>
            <Spacer y={3} />
            <Text h3 style={{ fontFamily: "Quicksand" }}>{t.sell}</Text>
            <Collapse.Group className={styles.collapse}>
                <Collapse title={t.whichItems}>
                    {t.weSellP1} <NextLink href="/product/sell"><Link color>{t.sellPage}</Link></NextLink>.
                </Collapse>
                <Collapse title={t.howToSend}>
                    {t.howToSellP1} <NextLink href="/product/sell"><Link color>{t.here}</Link></NextLink> {t.howToSellP2}
                </Collapse>
                <Collapse title={t.nonSelected}>
                    {t.twoOptions}
                    <ul className={styles.list}>
                        <li>{t.option1}</li>
                        <li>{t.option2}</li>
                    </ul>
                </Collapse>
                <Collapse title={t.whenWillIBePayed}>
                    {t.whenWillIBePayedContent}
                </Collapse>
                <Collapse title={t.questionsLeft}>
                    {t.qLeftP1} <Link href="mailto:contact@masecondecabane.com" color>contact@masecondecabane.com</Link>. {t.qLeftP2}
                </Collapse>
            </Collapse.Group>
        </Page>
        <Footer />
    </>
}

import Locales from "../locales/FAQ"
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