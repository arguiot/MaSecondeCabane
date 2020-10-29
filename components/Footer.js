import styles from '../styles/Footer.module.scss'
import { Mail, Facebook, Instagram } from "@geist-ui/react-icons"
import { Input, Grid, Button, Text, Col, Row, Collapse, Link } from '@geist-ui/react'
import NextLink from 'next/link'
import { useRouter } from "next/router"
import Locales from "../locales/Footer"

export default function Footer() {
    const router = useRouter()
    const t = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][router.locale]
    ]))

    const collapse = <Collapse.Group key="collapse" className={ styles.containerSmall }>
        <Collapse title={ t.stayUpdated } className={ styles.collapse }>
            <Input placeholder="example@mail.com">
                { t.subscribe }
            </Input>
        </Collapse>
        <Collapse title={ t.helpContact } className={ styles.collapse }>
            <Row>
                <Button icon={<Mail />} type="abort" auto size="large" onClick={() => window.location =
                "mailto:arguiot@gmail.com"}>Mail.</Button>
            </Row>
            <Row>
                <Button icon={<Facebook />} type="abort" auto size="large" onClick={() => window.location =
                "https://facebook.com"}>Facebook.</Button>
            </Row>
            <Row>
                <Button icon={<Instagram />} type="abort" auto size="large" onClick={() => window.location =
                "https://instagram.com"}>Instagram.</Button>
            </Row>
        </Collapse>
        <Collapse title={ t.about } className={ styles.collapse }>
            <NextLink href="/about">
                <a><Text type="secondary">{ t.whoAreWe }</Text></a>
            </NextLink>
            <NextLink href="/faq">
                <a><Text type="secondary">{ t.faq }</Text></a>
            </NextLink>
            <NextLink href="/privacy">
                <a><Text type="secondary">{ t.privacy }</Text></a>
            </NextLink>
        </Collapse>
    </Collapse.Group>

    const grid = <Grid.Container justify="space-evenly" gap={2} alignItems="center" className={ styles.containerBig } key="grid">
            <Grid xs={24} md={12}>
                <Row justify="center">
                    <Col style={{ width: "auto" }}>
                    <Text h3 style={{ opacity: ".7" }}>{ t.stayUpdated }</Text>
                    <Input placeholder="example@mail.com" type="email">
                        { t.subscribe }
                    </Input>
                    </Col>
                </Row>
            </Grid>
            <Grid xs={24} md={12}>
                <Row justify="center" gap={4}>
                    <Col style={{ width: "auto" }}>
                        <Text h3 style={{ paddingLeft: "25px", opacity: ".7" }}>{ t.helpContact }</Text>
                        <Row>
                            <Button icon={<Mail />} type="abort" auto size="large" onClick={() => window.location =
                            "mailto:arguiot@gmail.com"}>Mail.</Button>
                        </Row>
                        <Row>
                            <Button icon={<Instagram />} type="abort" auto size="large" onClick={() => window.location =
                            "https://www.instagram.com/masecondecabane/"}>Instagram.</Button>
                        </Row>
                    </Col>
                    <Col style={{ width: "auto" }}>
                        <Text h3 style={{ opacity: ".7" }}>{ t.about }</Text>
                        <NextLink href="/about">
                            <a><Text type="secondary">{ t.whoAreWe }</Text></a>
                        </NextLink>
                        <NextLink href="/faq">
                            <a><Text type="secondary">{ t.faq }</Text></a>
                        </NextLink>
                        <NextLink href="/privacy">
                            <a><Text type="secondary">{ t.privacy }</Text></a>
                        </NextLink>
                    </Col>
                </Row>

            </Grid>
        </Grid.Container>

    return <Col className={ styles.footer }>
    { collapse }
    { grid }
    <Text p align="center" type="secondary">Copyright © { new Date().getFullYear() } Ma Seconde Cabane. { t.allRightReserved }.<br/><Link href="https://dashboard.masecondecabane.com" icon target="_blank" rel="noopener noreferrer">Administration</Link></Text>
    </Col>
}