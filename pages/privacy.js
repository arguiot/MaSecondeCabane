import { Divider, Page, Row, Text } from "@geist-ui/react"
import Head from "next/head"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import { User } from '@geist-ui/react-icons'

export default function About() {
    return <>
	<Head>
		<title>Confidentialité</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page>
        <Row justify="center">
            <User size={96} />
        </Row>
        <Text h1 align="center">Confidentialité</Text>
        <Text h4 align="center">
            La protection de votre vie privée est importante pour nous. C’est la raison pour laquelle nous avons élaboré un Engagement de confidentialité qui régit la manière dont nous recueillons, utilisons, divulguons, transférons et stockons vos données personnelles.
        </Text>
        <Divider />
        <Text h3>Collecte et utilisation des données personnelles</Text>
        <Text p>
            Par données personnelles, nous entendons toutes les informations pouvant être utilisées pour identifier ou contacter une personne spécifique.
            <br />
            Bien que nous essayons a tout prix de limiter la quantité d'informations que nous disposons sur nos utilisateurs, certaines données personnelles sont indispensables au bon fonctionnement du site internet.
            <br />
            Voici quelques exemples de types de données personnelles que nous receuillons et comment nous pouvons les utiliser :
        </Text>
        <Text h4>Données personnelles que nous recueillons:</Text>
        <ul>
            <li>
                <Text p>
                    Lorsque vous vendez ou achetez un produit, nous pouvons collecter tout un ensemble d’informations, telles que votre nom, votre adresse postale, votre numéro de téléphone, votre adresse e-mail, les données de votre carte bancaire.
                </Text>
            </li>
            <li>
                <Text p>
                    Lorsque vous visiter ce site internet, nous collectons anonymement certaines données visant à l'amélioration du site tel que votre adresse IP, votre localisation approximative ainsi que d'autres informations sur votre comportement lors de votre visite.
                </Text>
            </li>
        </ul>
        <Text h4>Utilisation de vos données personnelles</Text>
        <Text p>
            Nous pouvons traiter vos données personnelles dans les objectifs décrits dans cet Engagement de confidentialité avec votre consentement, pour nous conformer à une obligation légale à laquelle nous sommes soumis.
        </Text>
        <ul>
            <li>
                <Text p>
                    Les données personnelles que nous recueillons nous permettent de vous informer des dernières annonces produits et des mises à jours de notre service. Si vous ne souhaitez pas figurer sur notre liste de diffusion, vous pouvez vous y opposer à tout moment en mettant à jour vos préférences via notre partenaire.
                </Text>
            </li>
            <li>
                <Text p>
                    Nous utilisons également vos données personnelles pour créer, développer, utiliser, livrer et améliorer nos produits, services, contenus et publicités, et à des fins de prévention des pertes et de lutte contre la fraude. Nous pouvons aussi utiliser vos données personnelles dans des objectifs de sécurité des comptes et réseaux, notamment afin de protéger nos services pour le bénéfice de tous nos utilisateurs, ainsi que filtrer et analyser tout contenu chargé pour nous assurer qu’il ne contient pas de contenus illégaux. Lorsque nous utilisons vos données à des fins de lutte contre la fraude, c’est suite à une transaction en ligne auprès de nous. Nous limitons notre utilisation des données à des fins de lutte contre la fraude aux données strictement nécessaires et dans le cadre de nos intérêts légitimes estimés afin de protéger nos clients et nos services. Pour certaines transactions en ligne, nous pouvons également vérifier les informations que vous nous avez fournies auprès de sources publiquement disponibles.
                </Text>
            </li>
            <li>
                <Text p>
                    Nous pouvons également utiliser les données personnelles à des fins internes, par exemple pour des audits, analyses de données et recherches dans le but d’améliorer les produits, services et communications clients.
                </Text>
            </li>
        </ul>
        <Text h4>Cookies et autres technologies</Text>
        <Text p>
            Ce site web peut utiliser des « cookies » et d’autres technologies, telles que des « pixel tags » et des balises web. Ces technologies nous permettent de mieux comprendre le comportement des utilisateurs, nous indiquent quelles parties de nos sites web sont les plus visitées, et facilitent et mesurent l’efficacité des publicités et recherches Internet. Nous traitons les données collectées par les cookies et autres technologies comme des données non personnelles. Toutefois, si les adresses IP (Internet Protocol) ou des identifiants similaires sont considérés comme des données personnelles par la loi locale, nous traitons également ces identifiants comme des données personnelles. De la même manière, si des données non personnelles sont associées à des données personnelles, nous traitons les informations ainsi associées comme des données personnelles aux fins du présent Engagement de confidentialité.
            <br/>
            Nous utilisons également des cookies et d’autres technologies pour se souvenir de vos données personnelles lorsque vous utilisez un site web, des services en ligne et des applications. Dans ce cas, notre objectif est de rendre votre visite plus pratique et de la personnaliser.
        </Text>
    </Page>
    <Footer />
    </>
}