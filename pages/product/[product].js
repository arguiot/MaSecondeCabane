import { useRouter } from 'next/router'
import Product from '../../lib/Product'
import Head from 'next/head'
import NavBar from '../../components/NavBar'
import { Page, Display, Text, Image, Grid, Button, Collapse, Col, Spacer, Row, Spinner } from '@geist-ui/react'
import Manager from '../../lib/CartManager'

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

    return (<>
        <Head>
            <title>{ product.name }</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <Page>
            <Grid.Container gap={8} justify="center">
                <Grid xs={24} md={12}>
                    <Text h1>{ product.name }</Text>
                    <Display shadow caption={ product.description }>
                        <Image width={ 500 } src={ product.image } />
                    </Display>
                </Grid>
                <Grid xs={24} md={12}>
                    <Row justify="center">
                        <Button onClick={ addToCart } size="large" type="secondary" style={{ width: "100%" }}>Add to card</Button>
                    </Row>
                    <Spacer y={2} />
                    <Collapse.Group>
                        <Collapse title="Question A">
                            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.</Text>
                        </Collapse>
                        <Collapse title="Question B">
                            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.</Text>
                        </Collapse>
                    </Collapse.Group>
                </Grid>
            </Grid.Container>
        </Page>
        </>
    )
}

export async function getStaticProps({ params }) {
    const { product } = params

    return {
        props: {
            product: new Product({
                name: "Name",
                image: "https://source.unsplash.com/random",
                description: "A great product",
                price: 12
            }).json
        }
    }
}

export async function getStaticPaths() {
    return {
      // Only `/posts/1` and `/posts/2` are generated at build time
      paths: [{
          params: {
              product: '1'
          }
      }, {
          params: {
              product: '2'
          }
      }],
      // Enable statically generating additional pages
      // For example: `/posts/3`
      fallback: true,
    }
  }