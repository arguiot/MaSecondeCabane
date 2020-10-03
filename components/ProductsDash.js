import { Spinner, Divider, Description, Input, Modal, Code, Button, Col, Image, Row, Text, Spacer, Fieldset, Grid, useModal, ButtonGroup } from "@geist-ui/react";
import useSWR from 'swr';
import { Notification, NotificationCenter } from '@arguiot/broadcast.js';
import router from 'next/router'
import pStyles from '../styles/ProductCard.module.scss'
import { AllProducts } from '../lib/Requests';
import { graphQLClient } from '../utils/fauna';

const fetcher = async (query) => await graphQLClient.request(query);
export default function ProductsDash() {
    const { data, error } = useSWR(AllProducts, fetcher);

    const {setVisible, bindings} = useModal()
    const [selected, setSelected] = React.useState({})
    const [generating, setGenerating] = React.useState(false)
    const [quantity, setQuantity] = React.useState(1)
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

    function generateEtiquette(product) {
        setVisible(true)
        setSelected(product)
    }

    async function printEtiquette() {
        setGenerating(true)
        const printJS = (await import('print-js')).default
        Array.prototype.fill = function(val){
            for (var i = 0; i < this.length; i++){
                this[i] = val;
            }
            return this;
        };
        printJS({
            printable: Array(quantity).fill(`/api/barcode?id=${selected._id}`),
            type: 'image',
            header: selected.name,
            imageStyle: 'width:288px;height:142px;margin-bottom:20px;display:inline-block;'
        })
        setGenerating(false)
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
                    <Grid.Container gap={1} justify="center">
                        <Grid xs={7}>
                            <Image src={ `https://ik.imagekit.io/ittx2e0v7x/tr:n-media_library_thumbnail/${product.image}` } height={100} className={ pStyles.img }/>
                        </Grid>
                        <Grid xs={13}>
                            <Text h5>{ product.name }</Text>
                            <Text p className={ pStyles.truncate }>{ product.description }</Text>
                        </Grid>
                        <Grid xs={4}>
                            <Row align="middle" style={{ height: '100%' }}>
                                <Text h5>{ product.price }$</Text>
                            </Row>
                        </Grid>
                    </Grid.Container>
                </Fieldset.Content>
                <Fieldset.Footer>
                    <Fieldset.Footer.Status>
                        Stock: { product.quantity }
                    </Fieldset.Footer.Status>
                    <Fieldset.Footer.Actions>
                        <ButtonGroup auto size="mini">
                            <Button onClick={() => generateEtiquette(product) }>Étiquette</Button>
                            <Button onClick={() => router.push("/product/[product]", `/product/${product._id}`) }>Afficher</Button>
                            <Button onClick={() => editProduct(product) }>Modifier</Button>
                        </ButtonGroup>
                        <Button auto size="mini" type="error" ghost style={{ margin: "6px" }}onClick={() => deleteProduct(product)}>Supprimer</Button>
                    </Fieldset.Footer.Actions>
                </Fieldset.Footer>
            </Fieldset>
            <Spacer y={.8} />
            </Grid>
            })
        }
    </Grid.Container>
    <Modal {...bindings}>
        <Modal.Title>Étiquette</Modal.Title>
        <Modal.Content>
            <Row justify="center" className="print">
                <Image width={288} height={142} src={ `/api/barcode?id=${selected._id}` } />
            </Row>
            <Spacer y={.8} />
            <Description title="Quantité" content={<Input value={quantity} width="100%" onChange={e => setQuantity(parseInt(e.target.value))} placeholder="Quantité" type="number" />} />
        </Modal.Content>
        <Modal.Action onClick={ printEtiquette } loading={generating}>Imprimer</Modal.Action>
    </Modal>
    </>
}