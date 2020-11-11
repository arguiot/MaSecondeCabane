import styles from '../styles/Footer.module.scss'
import { Mail, Facebook, Instagram, ArrowRight, HeartFill } from "@geist-ui/react-icons"
import { Input, Grid, Button, Text, Col, Row, Collapse, Link, Select, Spacer } from '@geist-ui/react'
import NextLink from 'next/link'
import { useRouter } from "next/router"
import Locales from "../locales/Footer"

export default function Footer() {
    const router = useRouter()
    const t = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][router.locale.split("-")[0]]
    ]))

    const changeLang = locale => {
        router.push(router.asPath, router.asPath, { locale })
    }

    const collapse = <Collapse.Group key="collapse" className={ styles.containerSmall }>
        <Collapse title={ t.stayUpdated } className={ styles.collapse }>
            <Text type="secondary">{ t.subscribe }</Text>
            <form action="https://masecondecabane.us2.list-manage.com/subscribe/post?u=3d03e13ba9d228fa2c7b947f1&amp;id=eb6f782737" method="post">
                <Row align="middle">
                    <Input placeholder="example@mail.com" type="email" name="EMAIL"/>
                    <Button iconRight={<ArrowRight />} auto type="abort" htmlType="submit"/>
                </Row>
            </form>
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
                    <Text type="secondary">{ t.subscribe }</Text>
                    <form action="https://masecondecabane.us2.list-manage.com/subscribe/post?u=3d03e13ba9d228fa2c7b947f1&amp;id=eb6f782737" method="post">
                        <Row align="middle">
                            <Input placeholder="example@mail.com" type="email" name="EMAIL"/>
                            <Button iconRight={<ArrowRight />} auto type="abort" htmlType="submit"/>
                        </Row>
                    </form>
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
    <Select initialValue={ router.locale } pure onChange={ changeLang }>
        <Select.Option value="en-CA">
            <Row align="middle">
                {/* <img src="/img/us.svg" width={ 24 } height={ 24 }/> */}
                <Text style={{ marginLeft: "10px" }}>English</Text>
            </Row>
        </Select.Option>
        <Select.Option value="fr-CA">
            <Row align="middle">
                {/* <img src="/img/fr.svg" width={ 24 } height={ 24 }/> */}
                <Text style={{ marginLeft: "10px" }}>Français</Text>
            </Row>
        </Select.Option>
    </Select>
    <Spacer y={.5} />
    <Text p align="center" type="secondary">
        <Text b align="center">{ t.made } <HeartFill size={ 14 } /> { t.montreal }</Text><br/>
        Copyright © { new Date().getFullYear() } Ma Seconde Cabane. { t.allRightReserved }.<br />
        <Link href="https://dashboard.masecondecabane.com" icon target="_blank" rel="noopener noreferrer">
            Administration
        </Link>
    </Text>
    </Col>
}