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
            Chez ma Seconde Cabane, nous proposons de donner une seconde vie aux articles de vos bambins!
        </Text>
        <Text p align="justify">
            Acheter en seconde main ne veut pas dire de mauvaise qualité, au contraire ! Des vêtements encore neufs, ou peu utilisés ou encore en parfaite condition, nous en avons tous dans les penderies de nos enfants. Imaginez qu'entre 0 et 1 an, les vêtements ne sont portés que quelques semaines... Créer un vide dressing chic et de qualité pour que nous puissions partager tous ensemble nos trésors.
        </Text>
        <Text h4>Comment ça marche?</Text>
        <Text p align="justify">
            Nous séléctionnons ensemble les plus belles pièces de votre penderie que nous vous rachetons comptant. Des vêtements d’occasion de marque méticuleusement choisis et en parfait état. Et pour le reste nous nous en occupons !
        </Text>
        <Text p>
            Consultez notre site et découvrez nos nouveaux articles. N'hésitez pas à nous contacter si vous avez besoin d'aide.
        </Text>
        <Text h5>Bon magasinage !</Text>
    </Page>
    <Footer />
    </>
}