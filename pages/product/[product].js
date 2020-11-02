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
import Skeleton from '../../components/Skeleton'

const ReactImageZoom = dynamic(() => import('react-image-zoom'))


export default function ProductPage({ product, t }) {
    const router = useRouter()
    const [imageLoaded, setImageLoaded] = React.useState(false)

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

    React.useEffect(() => {
        window.imageInterval = setInterval(() => {
            const query = `.${styles.image} img`
            const element = document.querySelector(query)
            if (element != null && typeof element != "undefined") {
                setImageLoaded(element.complete)
                if (element.complete === true) {
                    clearInterval(window.imageInterval)
                }
            }
        }, 100)
    }, [])

    const addToCart = () => {
        Manager.addItem(product)
    }
    function etat(e) {
        switch (e) {
            case "Bon":
                return t.veryGood
            case "Excellent":
                return t.excellent
            case "Neuf":
                return t.new
            default:
                return "-"
        }
    }
    const table = [
        {
            property: t.gender,
            detail: getSex(product.sexe, router.locale)
        },
        {
            property: t.size,
            detail: getSize(product.size, router.locale)
        },
        {
            property: t.brand,
            detail: product.brand
        },
        {
            property: t.category,
            detail: getCategory(product.type, router.locale)
        },
        {
            property: t.composition,
            detail: product.composition == null ? "N/A" : product.composition
        },
        {
            property: t.condition,
            detail: etat(product.etat)
        },
        {
            property: t.stock,
            detail: product.quantity
        }
    ]

    function getDescription(product, lang) {
        if (lang == "en-CA" && product.descriptionEn != null) {
            return product.descriptionEn
        }
        return product.description
    }

    return (<>
        <Head>
            <title>Ma Seconde Cabane - { product.name }</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content={ getDescription(product, router.locale) } />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context" : "http://schema.org",
                "@type" : "Product",
                "name" : product.name,
                "image" : `https://ik.imagekit.io/ittx2e0v7x/tr:n-media_library_thumbnail,fo-auto/${product.image}`,
                "description" : getDescription(product, router.locale),
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
                <Grid xs={24} md={12} className={ styles.image }>
                    <Skeleton display={ !imageLoaded }/>
                    <ReactImageZoom width={ 500 } height={400} img={ `https://ik.imagekit.io/ittx2e0v7x/tr:w-1000/${product.image}` } zoomPosition="original" />
                </Grid>
                <Grid xs={24} md={12}>
                    <Text h2>{ product.name }</Text>
                    <Text p>{ getDescription(product, router.locale) }</Text>
                    <Description title={ t.size } content={ getSize(product.size, router.locale) }/>
                    <Spacer y={.8} />
                    <Description title={ t.condition } content={ etat(product.etat) } />
                    <Spacer y={1} />
                    <Row justify="center" style={{ alignItems: "center" }}>
                        <Button onClick={ addToCart } size="large" type="secondary" style={{ width: "100%" }} shadow disabled={ product.quantity < 1 } >{ t.addToBasket }</Button>
                        <Spacer x={1} />
                        <Text h2 className={ styles.normalFont } style={{ color: "#ea4335", margin: "0" }}>{ product.price }$</Text>
                    </Row>
                    {
                        product.quantity < 1 && <Text i align="center">{ t.noStock }</Text>
                    }
                    <Spacer y={2} />
                    <Collapse.Group>
                        <Collapse title={ t.details }>
                            <Table data={table}>
                                <Table.Column prop="property" label={ t.property } />
                                <Table.Column prop="detail" label={ t.detail } />
                            </Table>
                        </Collapse>
                    </Collapse.Group>
                </Grid>
            </Grid.Container>
            <Spacer y={2} />
            <Text h2>{ t.faq }</Text>
            <Collapse.Group className={ styles.collapse }>
                <Collapse title={ t.questionsTitle }>
                    { t.questionsP1 } <Link href="mailto:contact@masecondecabane.com" color>contact@masecondecabane.com</Link>. { t.questionsP2 }
                </Collapse>
                <Collapse title={ t.paymentTitle }>
                    { t.paymentContent }
                </Collapse>
                <Collapse title={ t.whenArrive }>
                    { t.whenArriveContent }
                </Collapse>
                <Collapse title={ t.controlledTitle }>
                    { t.controlledContent }
                </Collapse>
            </Collapse.Group>
        </Page>
        <Footer />
        </>
    )
}

import Locales from "../../locales/[Product]"
import { getCategory, getSex, getSize } from '../../locales/Fuse'

export async function getStaticProps({ params, locale }) {
    if (typeof params.product != "string") {
        return {
            notFound: true
        }
    }

    const { product } = params
    const query = ProductByID
    const result = await graphQLClient.request(query, {
        id: product
    })
    // Locales
	const locales = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][locale.split("-")[0]]
    ]))
    
    return {
        props: {
            product: result.findProductByID,
            t: locales
        },
        revalidate: 300
    }
}

export async function getStaticPaths({ locales }) {
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

    const modifier = lang => {
        return entry => {
            return {
                params: {
                    product: entry._id
                },
                locale: lang
            }
        }
    }
    let paths = []
    locales.forEach(lang => {
        paths = paths.concat(data.map(modifier(lang)))
    })
    return {
      // Only `/posts/1` and `/posts/2` are generated at build time
      paths,
      // Enable statically generating additional pages
      // For example: `/posts/3`
      fallback: true,
    }
  }