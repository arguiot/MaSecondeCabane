import styles from '../styles/Footer.module.scss'
import { Mail, Facebook, Instagram } from "@geist-ui/react-icons"
import { Input, Grid, Button, Text, Col, Row, Collapse, Link } from '@geist-ui/react'
import NextLink from 'next/link'
export default function Footer() {
    const collapse = <Collapse.Group key="collapse" className={ styles.containerSmall }>
        <Collapse title="Tenez-vous au courant!" className={ styles.collapse }>
            <Input placeholder="example@mail.com">
                S'inscrire à la newsletter
            </Input>
        </Collapse>
        <Collapse title="Aide & Contact" className={ styles.collapse }>
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
        <Collapse title="À propos" className={ styles.collapse }>
            <NextLink href="/about">
                <a><Text type="secondary">Qui sommes-nous?</Text></a>
            </NextLink>
            <NextLink href="#">
                <a><Text type="secondary">Conditions générales</Text></a>
            </NextLink>
            <NextLink href="/privacy">
                <a><Text type="secondary">Confidentialité</Text></a>
            </NextLink>
        </Collapse>
    </Collapse.Group>

    const grid = <Grid.Container justify="space-evenly" gap={2} alignItems="center" className={ styles.containerBig } key="grid">
            <Grid xs={24} md={12}>
                <Row justify="center">
                    <Col style={{ width: "auto" }}>
                    <Text h3>Tenez-vous au courant!</Text>
                    <Input placeholder="example@mail.com" type="email">
                    S'inscrire à la newsletter
                    </Input>
                    </Col>
                </Row>
            </Grid>
            <Grid xs={24} md={12}>
                <Row justify="center" gap={4}>
                    <Col style={{ width: "auto" }}>
                        <Text h3 style={{ paddingLeft: "25px" }}>Aide & Contact</Text>
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
                            "https://www.instagram.com/masecondecabane/"}>Instagram.</Button>
                        </Row>
                    </Col>
                    <Col style={{ width: "auto" }}>
                        <Text h3>À propos</Text>
                        <NextLink href="/about">
                            <a><Text type="secondary">Qui sommes-nous?</Text></a>
                        </NextLink>
                        <NextLink href="/faq">
                            <a><Text type="secondary">FAQ</Text></a>
                        </NextLink>
                        <NextLink href="/privacy">
                            <a><Text type="secondary">Confidentialité</Text></a>
                        </NextLink>
                    </Col>
                </Row>

            </Grid>
        </Grid.Container>

    return <Col className={ styles.footer }>
    { collapse }
    { grid }
    <Text p align="center" type="secondary">Copyright © { new Date().getFullYear() } Ma Seconde Cabane. Tous droits réservés.<br/><Link href="https://dashboard.masecondecabane.com" icon target="_blank" rel="noopener noreferrer">Administration</Link></Text>
    </Col>
}