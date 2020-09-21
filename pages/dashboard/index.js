import { signIn, signOut, useSession } from 'next-auth/client'
import { Divider, Page, Tabs, Modal, Code, Button, Col, Image, Row, Text, Spacer, Fieldset, Grid } from '@geist-ui/react'
import Head from 'next/head'
import NavBar from '../../components/NavBar'
import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphQLClient } from '../../utils/fauna';
import ProductForm from '../../components/ProductForm';
import { Notification, NotificationCenter } from '@arguiot/broadcast.js';
import router from 'next/router'
import pStyles from '../../styles/ProductCard.module.scss'

const fetcher = async (query) => await graphQLClient.request(query);

export default function Dashboard() {
    const [ session, loading ] = useSession()

    if (!session) {
        // signIn()
        return <button onClick={signIn}>Sign in</button>
    }

    const { data, error } = useSWR(
    gql`
    query AllProducts {
        allProducts {
            data {
                name
                image
                quantity
                description
                price
                _id
                category {
                    name
                    _id
                }
            }
        }
    }
    `,
    fetcher
    );
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
    let categories = {}
    products.forEach(prod => {
        if (typeof categories[prod.category.name] != "undefined") {
            categories[prod.category.name].push(prod)
        } else {
            categories[prod.category.name] = [prod]
        }
    });
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
        <Tabs initialValue="1">
            <Tabs.Item label="overview" value="1">The Evil Rabbit Jumped over the Fence.</Tabs.Item>
            <Tabs.Item label="products" value="2">
                {
                    Object.keys(categories).map(key => {
                        const products = categories[key]
                        return <>
                        <Divider align="start">{ key }</Divider>
                        {
                            products.map(product => {
                            return <Grid xs={24} md={12}>
                            <Fieldset>
                                <Fieldset.Content>
                                    <div className={ pStyles.container }>
                                        <Image src={ product.image } height={100} className={ pStyles.img }/>
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
                                        <Button auto size="mini" onClick={() => router.push("/product/[product]", `/product/${product._id}`) }>View</Button>
                                        <Spacer x={.4} />
                                        <Button auto size="mini" onClick={() => editProduct(product) }>Edit</Button>
                                    </Fieldset.Footer.Actions>
                                </Fieldset.Footer>
                            </Fieldset>
                            <Spacer y={.8} />
                            </Grid>
                        })
                    }
                    </>
                })
            }
            </Tabs.Item>
        </Tabs>
        </Page>
        <ProductForm />
    </>
}