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
                "mailto:contact@masecondecabane.com"}>{ t.mail }.</Button>
            </Row>
            <Row>
                <a href="https://www.instagram.com/masecondecabane/" target="_blank"><Button icon={<Instagram />} type="abort" auto size="large">Instagram.</Button></a>
            </Row>
            <Row>
                <a href="https://www.facebook.com/masecondecabane" target="_blank"><Button icon={<Facebook />} type="abort" auto size="large">Facebook.</Button></a>
            </Row>
            <Row>
                <a href="https://www.pinterest.com/MaSecondeCabane/" target="_blank"><Button icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" shape-rendering="geometricPrecision" viewBox="-1 -1 26 27" height="24" width="24" style={{ color: "currentColor" }}><title>Pinterest icon</title><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
                } type="abort" auto size="large">Pinterest.</Button></a>
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
                            "mailto:contact@masecondecabane.com"}>{ t.mail }.</Button>
                        </Row>
                        <Row>
                            <a href="https://www.instagram.com/masecondecabane/" target="_blank"><Button icon={<Instagram />} type="abort" auto size="large">Instagram.</Button></a>
                        </Row>
                        <Row>
                            <a href="https://www.facebook.com/masecondecabane" target="_blank"><Button icon={<Facebook />} type="abort" auto size="large">Facebook.</Button></a>
                        </Row>
                        <Row>
                            <a href="https://www.pinterest.com/MaSecondeCabane/" target="_blank"><Button icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" shape-rendering="geometricPrecision" viewBox="-1 -1 26 27" height="24" width="24" style={{ color: "currentColor" }}><title>Pinterest icon</title><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
                            } type="abort" auto size="large">Pinterest.</Button></a>
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