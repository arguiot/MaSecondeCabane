import { Button, Col, Image, Modal, Row, Text, Spacer, Fieldset, Grid, Divider, Card } from "@geist-ui/react";

import Manager from '../lib/CartManager'
import { Notification, NotificationCenter } from '@arguiot/broadcast.js'
import pStyles from '../styles/ProductCard.module.scss'

export default function Basket({
    bindings
}) {
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    NotificationCenter.default.addObserver("newItem", data => {
        forceUpdate()
    }, "Basket")
    
    if (Manager.numberOfItems == 0) {
        return <Modal {...bindings}>
                    <Modal.Title>Panier</Modal.Title>
                    <Modal.Subtitle>Vide</Modal.Subtitle>
                    <Modal.Content>
                        <Text align="center">Veuillez ajouter quelque chose à votre panier.</Text>
                    </Modal.Content>
                </Modal>
    }
    return <Modal width="80vw" {...bindings}>
        <Modal.Title>Panier</Modal.Title>
        <Modal.Content>
            <Divider>Contenu</Divider>
            <Grid.Container gap={2} justify="flex-start">
            {
                Manager.cart.map(product => {
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
                                Quantité: { product.quantity }
                            </Fieldset.Footer.Status>
                            <Fieldset.Footer.Actions>
                                <Button auto size="mini" type="error" ghost onClick={() => Manager.removeProduct(product.id) }>Supprimer</Button>
                            </Fieldset.Footer.Actions>
                        </Fieldset.Footer>
                    </Fieldset>
                    <Spacer y={.8} />
                    </Grid>
                })
            }
            </Grid.Container>
            <Divider>Total</Divider>
            <Card>
                <Row justify="space-between">
                    <Text b>Subtotal</Text>
                    <Text b>{ Manager.subtotal }</Text>
                </Row>
            </Card>
            <Spacer y={1} />
            <Row justify="end" style={{ width: "100%" }}>
                <Button shadow type="secondary">Checkout</Button>
            </Row>
        </Modal.Content>
    </Modal>
}