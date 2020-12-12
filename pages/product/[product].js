import { useRouter } from 'next/router'
import Head from 'next/head'
import NavBar from '../../components/NavBar'
import { Page, Display, Text, Grid, Button, Collapse, Divider, Spacer, Row, Spinner, Description, Table, Link, Tooltip, useToasts } from '@geist-ui/react'
import Manager from '../../lib/CartManager'
import { graphQLClient } from '../../utils/fauna'
import { gql } from 'graphql-request'
import { ProductByID } from '../../lib/Requests'
import Footer from '../../components/Footer'
import styles from "../../styles/Product.module.scss"
import dynamic from 'next/dynamic'
import Skeleton from '../../components/Skeleton'
import React from "react";
import { Info } from '@geist-ui/react-icons'

const ReactImageZoom = dynamic(() => import('react-image-zoom'))


export default function ProductPage({ product, t }) {
    const router = useRouter()
    const [imageLoaded, setImageLoaded] = React.useState(false)
    const [toasts, setToast] = useToasts()

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    NotificationCenter.default.addObserver("newItem", data => {
        forceUpdate()
    }, "Product")

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

        setToast({
            text: t.added,
            type: "secondary",
            actions: [{
                name: t.cancel,
                passive: true,
                handler: () => {
                    Manager.removeProduct(product._id)
                    setToast({
                        text: t.removed,
                        type: "error",
                        actions: [{
                            name: t.cancel,
                            handler: addToCart,
                            passive: true
                        }]
                    })
                }
            }]
        })
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
    function etatHelp(e) {
        switch (e) {
            case "Bon":
                return t.veryGoodHelp
            case "Excellent":
                return t.excellentHelp
            case "Neuf":
                return t.newHelp
            default:
                return t.conditionHelp
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
            detail: product.composition == null ? "N/A" : getComposition(product, router.locale)
        },
        {
            property: t.condition,
            detail: <Row align="middle">
            <Text>{ etat(product.etat) }</Text>
            <Tooltip text={ etatHelp(product.etat) } type="dark" className={ styles.infoHelp }>
                <Info size={16}/>
            </Tooltip>
            </Row>
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
                "image" : `https://images.masecondecabane.com/${product.image}?auto=compress&w=150&h=150&fit=crop`,
                "description" : getDescription(product, router.locale),
                "url": `https://masecondecabane.com/product/${product._id}`,
                "sku": `${product._id}`,
                "brand" : {
                    "@type" : "Brand",
                    "name" : "Ma Seconde Cabane",
                    "logo" : "https://store.arguiot.vercel.app/logo.svg"
                },
                "offers" : {
                    "@type" : "Offer",
                    "price" : `${product.price}`,
                    "priceCurrency": "CAD",
                    "availability": product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    "priceValidUntil": new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // In 5 days
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "5",
                    "reviewCount": "0"
                }
            })}} />
        </Head>
        <NavBar />
        <Page>
            <Grid.Container gap={8} justify="center">
                <Grid xs={24} md={12} className={ styles.image }>
                    <Skeleton display={ !imageLoaded }/>
                    <ReactImageZoom width={ 500 } height={400} img={ `https://images.masecondecabane.com/${product.image}?auto=format&w=1000&q=75` } zoomPosition="original" />
                </Grid>
                <Grid xs={24} md={12}>
                    <Text h3>{ product.name }</Text>
                    <Text p>{ getDescription(product, router.locale) }</Text>
                    <Description title={ t.size } content={ getSize(product.size, router.locale) }/>
                    <Spacer y={.8} />
                    <Description title={ t.condition } content={ etat(product.etat) } />
                    <Spacer y={1} />
                    <Row justify="center" style={{ alignItems: "center" }}>
                        <Button onClick={ addToCart } size="large" type="secondary" style={{ width: "100%" }} shadow disabled={ 
                            (product.quantity < 1) || (!Manager.checkStock(product._id, product.quantity))
                         } >{ t.addToBasket }</Button>
                        <Spacer x={1} />
                        <Text h2 className={ styles.normalFont } style={{ color: "#ea4335", margin: "0" }}>{ product.price }$</Text>
                    </Row>
                    {
                        product.quantity < 1 && <Text i align="center">{ t.noStock }</Text>
                    }
                    <Spacer y={2} />
                    <Collapse.Group>
                        <Collapse title={ t.details }>
                            <Table data={table} className={ styles.table }>
                                <Table.Column prop="property" label={ t.property } />
                                <Table.Column prop="detail" label={ t.detail } />
                            </Table>
                        </Collapse>
                    </Collapse.Group>
                </Grid>
            </Grid.Container>
            <Spacer y={2} />
            <Text h3>{ t.faq }</Text>
            <Collapse.Group className={ styles.collapse }>
                <Collapse title={ t.questionsTitle }>
                    { t.questionsP1 } <Link href="mailto:contact@masecondecabane.com" color>contact@masecondecabane.com</Link>. 
                    <br/>
                    { t.questionsP2 }
                </Collapse>
                <Collapse title={ t.controlledTitle }>
                    { t.controlledContent }<br/>
                    { t.weDefine }
                    <ul className={ styles.list }>
                        <li>{ t.goodConditions }</li>
                        <li>{ t.excellentConditions }</li>
                        <li>{ t.newWithLabel }</li>
                    </ul>
                </Collapse>
                <Collapse title={ t.paymentTitle }>
                    { t.paymentContent }
                </Collapse>
                <Collapse title={ t.whenArrive }>
                    { t.whenArriveContent }
                </Collapse>
            </Collapse.Group>
        </Page>
        <Footer />
        </>
    )
}

import Locales from "../../locales/[Product]"
import { getCategory, getComposition, getSex, getSize } from '../../locales/Fuse'
import { NotificationCenter } from '@arguiot/broadcast.js'

export async function getStaticProps({ params, locale }) {
    if (typeof params.product != "string") {
        return {
            notFound: true
        }
    }

    try {
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
    } catch(e) {
        console.log(e);
        return {
            notFound: true
        }
    }
}

export async function getStaticPaths({ locales }) {
    const query = gql`
    query AllProducts($size: Int) {
        allProducts(_size: $size) {
            data {
                _id
            }
        }
    }
    `
    const result = await graphQLClient.request(query, { size: 1000 })

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