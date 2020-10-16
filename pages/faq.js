import { Avatar, Card, Col, Collapse, Divider, Image, Link, Page, Row, Spacer, Text } from "@geist-ui/react"
import { QuestionCircle } from '@geist-ui/react-icons'

import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import NextLink from "next/link"
import styles from "../styles/FAQ.module.scss"

export default function About() {
    return <>
	<Head>
		<title>Ma Seconde Cabane - FAQ</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page className={ styles.noTitleFancy }>
        <Row justify="center">
           <QuestionCircle size={96} />
        </Row>
        <Text h1 align="center">Des questions?</Text>
        <Spacer y={3} />
        <Text h2 style={{ fontFamily: "Quicksand" }}>ACHETER SUR MA SECONDE CABANE</Text>
        <Collapse.Group>
        <Collapse title="J’ai des questions à propos d’un article mis en vente, comment faire ?">
            Pour toutes vos questions concernant un article, veuillez envoyer un mail à l'adresse suivante : <Link href="mailto:contact@masecondecabane.com" color>contact@masecondecabane.com</Link>.
            Nous nous ferons un plaisir de vous renseigner.
        </Collapse>
        <Collapse title="Quels sont les moyens de paiement acceptés ?">
        Notre système de paiement est Stripe. Toutes les cartes de crédit et débit sont acceptés (à conditions que votre banque accepte les achats en ligne). Vous pouvez également utiliser Apple Pay et Google Pay pour passer à la caisse encore plus vite!
        </Collapse>
        <Collapse title="Quand vais je recevoir ma commande ?">
            Votre commande est expédiée entre 24h et 72h selon le moment où vous passez votre commande. Les commandes enregistrées sur le site le vendredi après 12h, le samedi, le dimanche ou les jours fériés seront traitées le lundi suivant.
            Malheureusement, nous ne sommes pas responsables des délais des transporteurs.
            Les articles commandés seront livrés à l’adresse que vous avez indiqué.
        </Collapse>
        <Collapse title="Est-ce que les articles mis en ligne sont controlés avant d’etre envoyés ?">
        Tous les articles mis en ligne sont mignutieusement controlés par nos soins. En achetant sur le site, vous êtes certains de la grande qualité des produits à ce propos nous ne proposons que des articles neufs, excellents ou très bon état.
        </Collapse>
        </Collapse.Group>
        <Spacer y={3} />
        <Text h2 style={{ fontFamily: "Quicksand" }}>VENDRE SUR MA SECONDE CABANE</Text>
        <Collapse.Group>
        <Collapse title="Quels articles peut on vendre sur le site ?">
        Nous vendons des vêtements de marque pour bébés et enfants jusqu’à 10 ans. Tous les vêtements qui sont mis en vente sont neufs ou en parfait état. Tous les articles que vous nous confiez doivent être lavés et en excellent état : sans tâche, ni trou, ni bouloche. Si vous avez un doute sur les produits que vous souhaitez vendre, n’hésitez pas à nous envoyer un mail à <Link href="mailto:contact@masecondecabane.com" color>contact@masecondecabane.com</Link>, nous nous ferons un plaisir de vous répondre. Pour avoir plus d’informations sur nos conditions de vente, nous vous invitons à consulter notre page <NextLink href="/product/sell"><Link color>Vendre</Link></NextLink>.
        </Collapse>
        <Collapse title="Comment faire pour vendre mes articles ?">
        Rien de plus simple ! Il vous suffit de cliquer <NextLink href="/product/sell"><Link color>ici</Link></NextLink>.
        Pour les habitants de la région du grand Montréal: nous nous déplaçons directement chez vous. Prenez RDV via le formulaire et nous trouverons le moment qui convient pour venir chez vous. Pour le reste du Québec, nous travaillons à un système de collecte mais vous pouvez d'ores et déjà remplir le formulaire pour nous faire part de votre demande.
        </Collapse>
        <Collapse title="Quand serais-je payé ?">
            Dans les jours suivant la réception de votre collecte, nous vous enverrons un mail avec la fiche récapitulative des vêtements que vous nous avez confiés, ainsi que la somme que nous devons vous régler.
        </Collapse>
        <Collapse title="Comment serais-je payé ?">
            Dès réception de vos coordonnées bancaires, un virement par interact sera effectué sur votre compte bancaire.
        </Collapse>
        </Collapse.Group>
    </Page>
    <Footer />
    </>
}