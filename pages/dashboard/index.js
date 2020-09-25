import { signin, signIn, signout, signOut, useSession } from 'next-auth/client'
import { Divider, Page, Tabs, Modal, Code, Button, Col, Image, Row, Text, Spacer, Fieldset, Grid } from '@geist-ui/react'
import Head from 'next/head'
import NavBar from '../../components/NavBar'
import useSWR from 'swr';
import { graphQLClient } from '../../utils/fauna';
import ProductForm from '../../components/ProductForm';
import { Notification, NotificationCenter } from '@arguiot/broadcast.js';
import router from 'next/router'
import pStyles from '../../styles/ProductCard.module.scss'
import { AllProducts } from '../../lib/Requests';

const fetcher = async (query) => await graphQLClient.request(query);

export default function Dashboard() {
    const [ session, loading ] = useSession()

    if (!session) {
        // signIn()
        return <>
        <Head>
            <title>Dashboard</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <Spacer y={5} />
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <Text h1>Administration</Text>
            <Button auto type="success" onClick={ () => signin("google") }>Sign In With Google</Button>
        </div>
        </>
    }

    const { data, error } = useSWR(AllProducts, fetcher);
    if (error) {
    return <Modal open={true}>
            <Modal.Title>Error</Modal.Title>
            <Modal.Content>
                <p>Something went wrong</p>
                <Code block>{error}</Code>
            </Modal.Content>
        </Modal>
    }
    if (typeof data == "undefined") {
        return <>
        <Head>
            <title>Loading</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        
        </>
    }
    
    const products = data.allProducts.data
    function editProduct(product) {
        const msg = new Notification("editProduct", product)
        NotificationCenter.default.post(msg)
    }
    return <>
        <Head>
            <title>Dashboard</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <Page>
            <Row justify="space-between" width="100%" style={{ flexWrap: "wrap-reverse" }}>
                <Text h1>Dashboard</Text>
                <Button auto type="secondary" onClick={ signout }>Sign Out</Button>
            </Row>
            <Tabs initialValue="1">
                <Tabs.Item label="overview" value="1">The Evil Rabbit Jumped over the Fence.</Tabs.Item>
                <Tabs.Item label="produits" value="2">
                    <Grid.Container gap={2} justify="flex-start">
                        {
                            products.map(product => {
                            return <Grid xs={24} md={11}>
                            <Fieldset>
                                <Fieldset.Content>
                                    <div className={ pStyles.container }>
                                        <Image src={ `https://ik.imagekit.io/ittx2e0v7x/tr:n-media_library_thumbnail/${product.image}` } height={100} className={ pStyles.img }/>
                                        <Col className={ pStyles.desc }>
                                            <Text h5>{ product.name }</Text>
                                            <Text p className={ pStyles.truncate }>{ product.description }</Text>
                                        </Col>
                                        <Spacer x={2} />
                                        <Col span={3}>
                                            <Row align="middle" style={{ height: '100%' }}>
                                                <Text h5>{ product.price }$</Text>
                                            </Row>
                                        </Col>
                                    </div>
                                </Fieldset.Content>
                                <Fieldset.Footer>
                                    <Fieldset.Footer.Status>
                                        Remaining Quantity: { product.quantity }
                                    </Fieldset.Footer.Status>
                                    <Fieldset.Footer.Actions>
                                        <Button auto size="mini" onClick={() => router.push("/product/[product]", `/product/${product._id}`) }>Afficher</Button>
                                        <Spacer x={.4} />
                                        <Button auto size="mini" onClick={() => editProduct(product) }>Modifier</Button>
                                    </Fieldset.Footer.Actions>
                                </Fieldset.Footer>
                            </Fieldset>
                            <Spacer y={.8} />
                            </Grid>
                            })
                        }
                    </Grid.Container>
                </Tabs.Item>
            </Tabs>
        </Page>
        <ProductForm />
    </>
}