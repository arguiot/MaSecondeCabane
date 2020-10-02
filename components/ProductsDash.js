import { Spinner, Divider, Page, Tabs, Modal, Code, Button, Col, Image, Row, Text, Spacer, Fieldset, Grid } from "@geist-ui/react";
import useSWR from 'swr';
import { Notification, NotificationCenter } from '@arguiot/broadcast.js';
import router from 'next/router'
import pStyles from '../styles/ProductCard.module.scss'
import { AllProducts } from '../lib/Requests';
import { graphQLClient } from '../utils/fauna';

const fetcher = async (query) => await graphQLClient.request(query);
export default function ProductsDash() {
    const { data, error } = useSWR(AllProducts, fetcher);
    if (error) {
        return <>
            <p>Something went wrong</p>
            <Code block>{JSON.stringify(error)}</Code>
        </>
    }
    if (typeof data == "undefined") {
        return <Row justify="center"><Spinner size="large"/></Row>
    }


    const products = data.allProducts.data
    function editProduct(product) {
        const msg = new Notification("editProduct", product)
        NotificationCenter.default.post(msg)
    }
    function deleteProduct(product) {
        const msg = new Notification("deleteProduct", product)
        NotificationCenter.default.post(msg)
    }

    return <>
    <Button onClick={() => {
        const msg = new Notification("newProduct")
        NotificationCenter.default.post(msg)
    }}>Nouveau produit</Button>
    <Divider>Produits</Divider>
    <Grid.Container gap={2} justify="flex-start">
        {
            products.map(product => {
            return <Grid xs={24} md={12}>
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
                        <Button auto size="mini" type="error" ghost onClick={() => deleteProduct(product)}>Supprimer</Button>
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
    </>
}