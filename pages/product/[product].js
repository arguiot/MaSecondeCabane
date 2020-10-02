import { useRouter } from 'next/router'
import Head from 'next/head'
import NavBar from '../../components/NavBar'
import { Page, Display, Text, Grid, Button, Collapse, Tag, Spacer, Row, Spinner, Description, Table } from '@geist-ui/react'
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
                    <Text h1>{ product.name }</Text>
                    <Display shadow caption={ `Taille: ${product.size}` } className={ styles.display }>
                        <ReactImageZoom width={ 500 } img={ `https://ik.imagekit.io/ittx2e0v7x/tr:w-750/${product.image}` } zoomPosition="original" />
                        {/* <Image width={ 500 } src={ `https://ik.imagekit.io/ittx2e0v7x/tr:w-500/${product.image}` } /> */}
                    </Display>
                </Grid>
                <Grid xs={24} md={12}>
                    <Row justify="space-between">
                        <Text h3>Prix</Text>
                        <Text h2 type="warning">{ product.price }$</Text>
                    </Row>
                    <Row justify="center">
                        <Button onClick={ addToCart } size="large" type="secondary" style={{ width: "100%" }} shadow disabled={ product.quantity < 1 } >Ajouter au panier</Button>
                    </Row>
                    <Spacer y={2} />
                    <Collapse.Group>
                        <Collapse title="Description" initialVisible >
                            <Description title="Tags" content={
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap"
                                }}>
                                    {
                                        product.tags.map((v, i) => <>
                                            <Tag type="success" invert style={{ margin: "3px" }}>
                                                { v }
                                            </Tag>
                                        </>)
                                    }
                                </div>
                            } />
                            <Spacer y={.8} />
                            <Description title="Descriptif" content={
                                <Text style={{ textAlign: "justify" }}>{ product.description }</Text>
                            } />
                        </Collapse>
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
            <Collapse.Group>
                <Collapse title="Question A">
                    <Text style={{ textAlign: "justify" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                        veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.</Text>
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