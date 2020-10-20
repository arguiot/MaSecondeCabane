import { useRouter } from 'next/router'
import Head from 'next/head'
import NavBar from '../../components/NavBar'
import { Page, Display, Text, Grid, Button, Collapse, Divider, Spacer, Row, Spinner, Description, Table, Link } from '@geist-ui/react'
import Manager from '../../lib/CartManager'
import { graphQLClient } from '../../utils/fauna'
import { gql } from 'graphql-request'
import { ProductByID } from '../../lib/Requests'
import Footer from '../../components/Footer'
import styles from "../../styles/Product.module.scss"
import dynamic from 'next/dynamic'

const ReactImageZoom = dynamic(() => import('react-image-zoom'))


export default function ProductPage({ product }) {
    const router = useRouter()

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <>
        <Head>
            <title>Loading</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <Spacer y={5} />
        <Row justify="center">
            <Spinner size="large" />
        </Row>
        </>
    }

    const addToCart = () => {
        Manager.addItem(product)
    }
    function etat(e) {
        switch (e) {
            case "Bon":
                return "Très bon état"
            case "Excellent":
                return "Excellent état"
            case "Neuf":
                return "Neuf"
            default:
                return "-"
        }
    }
    const table = [
        {
            property: "Genre",
            detail: product.sexe
        },
        {
            property: "Taille",
            detail: product.size
        },
        {
            property: "Marque",
            detail: product.brand
        },
        {
            property: "Catégorie",
            detail: product.type
        },
        {
            property: "Composition",
            detail: product.composition == null ? "N/A" : product.composition
        },
        {
            property: "État",
            detail: etat(product.etat)
        },
        {
            property: "Stock",
            detail: product.quantity
        }
    ]

    return (<>
        <Head>
            <title>Ma Seconde Cabane - { product.name }</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content={ product.description } />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context" : "http://schema.org",
                "@type" : "Product",
                "name" : product.name,
                "image" : `https://ik.imagekit.io/ittx2e0v7x/tr:n-media_library_thumbnail,fo-auto/${product.image}`,
                "description" : product.description,
                "brand" : {
                    "@type" : "Brand",
                    "name" : "Ma Seconde Cabane",
                    "logo" : "https://store.arguiot.vercel.app/logo.svg"
                },
                "offers" : {
                    "@type" : "Offer",
                    "price" : `${product.price}`,
                    "priceCurrency": "CAD",
                    "availability": product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                }
            })}} />
        </Head>
        <NavBar />
        <Page>
            <Grid.Container gap={8} justify="center">
                <Grid xs={24} md={12}>
                    <Display shadow className={ styles.display }>
                        <ReactImageZoom width={ 500 } height={400} img={ `https://ik.imagekit.io/ittx2e0v7x/tr:w-750/${product.image}` } zoomPosition="original" />
                    </Display>
                </Grid>
                <Grid xs={24} md={12}>
                    <Text h1>{ product.name }</Text>
                    <Text p>{ product.description }</Text>
                    <Description title="Taille" content={ product.size }/>
                    <Spacer y={.8} />
                    <Description title="État" content={ etat(product.etat) } />
                    <Spacer y={1} />
                    <Row justify="center" style={{ alignItems: "center" }}>
                        <Button onClick={ addToCart } size="large" type="secondary" style={{ width: "100%" }} shadow disabled={ product.quantity < 1 } >Ajouter au panier</Button>
                        <Spacer x={1} />
                        <Text h2 className={ styles.normalFont } style={{ color: "#ea4335", margin: "0" }}>{ product.price }$</Text>
                    </Row>
                    <Spacer y={2} />
                    <Collapse.Group>
                        <Collapse title="Détails">
                            <Table data={table}>
                                <Table.Column prop="property" label="Propriété" />
                                <Table.Column prop="detail" label="Détail" />
                            </Table>
                        </Collapse>
                    </Collapse.Group>
                </Grid>
            </Grid.Container>
            <Spacer y={2} />
            <Text h2>FAQ</Text>
            <Collapse.Group className={ styles.collapse }>
                <Collapse title="J’ai des questions à propos de cet article, comment faire ?">
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
        </Page>
        <Footer />
        </>
    )
}



export async function getStaticProps({ params }) {
    const { product } = params
    const query = ProductByID
    const result = await graphQLClient.request(query, {
        id: product
    })
    return {
        props: {
            product: result.findProductByID
        },
        revalidate: 300
    }
}

export async function getStaticPaths() {
    const query = gql`
    query AllProducts {
        allProducts {
            data {
                _id
            }
        }
    }
    `
    const result = await graphQLClient.request(query)

    const { data } = result.allProducts

    return {
      // Only `/posts/1` and `/posts/2` are generated at build time
      paths: data.map(entry => {
          return {
              params: {
                  product: entry._id
              }
          }
      }),
      // Enable statically generating additional pages
      // For example: `/posts/3`
      fallback: true,
    }
  }