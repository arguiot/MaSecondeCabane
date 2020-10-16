import { Avatar, Card, Col, Divider, Image, Page, Row, Spacer, Text } from "@geist-ui/react"
import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import styles from "../styles/About.module.scss"

export default function About() {
    return <>
	<Head>
		<title>Ma Seconde Cabane - À propos de nous</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page style={{ fontFamily: "var(--fancyFont)" }}>
        <Row justify="center">
            {/* <Users size={96} /> */}
            <Image src="/logo.svg" height={96} style={{ width: "unset", objectFit: "unset" }}/>
        </Row>
        <Text h1 align="center" className={ styles.title }>À propos de nous</Text>
        <Divider />
        <Text h4>
            Chez la Seconde Cabane, nous proposons de donner une nouvelle vie aux articles de vos bambins!
        </Text>
        <Text p align="justify">
            Acheter en seconde main ne veut pas dire de mauvaise qualité, au contraire ! Des vêtements encore neufs, ou peut utilisé ou encore en parfaite condition, nous en avons tous dans les penderies de nos enfants. Imaginez qu'entre 0 et 1 an, les vêtements ne sont portés que quelques semaines... Créer un vide dressing chic et de qualité pour que nous puissions partager tous ensemble nos trésors.
        </Text>
        <Text h4>Comment ça marche?</Text>
        <Text p align="justify">
            Nous séléctionnons ensemble les plus belles pièces de votre penderie que nous vous rachetons comptant. Des vêtements d’occasion de marque méticuleusement choisis et en parfait état. Et pour le reste nous nous en occupons !
        </Text>
        <Text p>
            Consultez notre site et découvrez nos nouveaux articles. N'hésitez pas à nous contacter si vous avez besoin d'aide.
        </Text>
        <Text h5>Bon magasinage !</Text>
        <Divider />
        <Text h4>Notre équipe</Text>
        <Row>
            <Card width="auto">
                <Row gap={2}>
                    <Avatar src="https://s.gravatar.com/avatar/0af70fdf7af284740a2b2d30354ac1df?s=120&d=mp" size={ 60 } className={ styles.avatar } />
                    <Col>
                        <Text h6>Élodie Iché</Text>
                        <Text small>CEO</Text>
                    </Col>
                </Row>
            </Card>
            <Spacer x={1} />
            <Card width="auto">
                <Row gap={2}>
                    <Avatar src="https://s.gravatar.com/avatar/55fa1b1cdc57993c94db4a49fdfed90c?s=120&d=mp" size={ 60 } className={ styles.avatar } />
                    <Col>
                        <Text h6>Arthur Guiot</Text>
                        <Text small>Webmaster</Text>
                    </Col>
                </Row>
            </Card>
        </Row>
    </Page>
    <Footer />
    </>
}