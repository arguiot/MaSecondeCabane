import { Button, Col, Image, Modal, Row, Text, Spacer, Fieldset, Grid, Divider, Card } from "@geist-ui/react";

import Manager from '../lib/CartManager'
import { Notification, NotificationCenter } from '@arguiot/broadcast.js'
import pStyles from '../styles/ProductCard.module.scss'
import { loadStripe } from "@stripe/stripe-js";
import Lottie from 'react-lottie';
import animationData from '../lotties/checkout.json';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_w5u3iYrl9ZVHPRHxmZQcUElC");

export default function Basket({
    bindings
}) {
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    NotificationCenter.default.addObserver("newItem", data => {
        forceUpdate()
    }, "Basket")
    
    const [message, setMessage] = React.useState("");

    React.useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get("success")) {
            setMessage("Order placed! You will receive an email confirmation.");
        }

        if (query.get("canceled")) {
            setMessage(
                "Order canceled -- continue to shop around and checkout when you're ready."
            );
        }
    }, []);

    const [checkout, setCheckout] = React.useState(false)
    const handleClick = async (event) => {
        setCheckout(true)
        const stripe = await stripePromise;

        const response = await fetch("/api/create-session", {
            method: "POST",
            body: localStorage.getItem("cart")
        });

        const session = await response.json();
        
        setCheckout(false)
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
            setCheckout(result.error.message)
        }
    };

    if (typeof checkout == "string") {
        return <Modal {...bindings}>
                    <Modal.Title>Erreur</Modal.Title>
                    <Modal.Subtitle>Un probleme est survenu</Modal.Subtitle>
                    <Modal.Content>
                        <Text align="center">{ checkout }</Text>
                    </Modal.Content>
                </Modal>
    }

    if (Manager.numberOfItems == 0) {
        return <Modal {...bindings}>
                    <Modal.Title>Panier</Modal.Title>
                    <Modal.Subtitle>Vide</Modal.Subtitle>
                    <Modal.Content>
                        <Text align="center">Veuillez ajouter quelque chose à votre panier.</Text>
                    </Modal.Content>
                </Modal>
    }
    const modal = <Modal width="80vw" {...bindings}>
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
                    <Text b>Sous total</Text>
                    <Text b>{ Manager.subtotal }</Text>
                </Row>
                <Row justify="space-between">
                    <Text b>TVA</Text>
                    <Text b>{ Math.round(Manager.subtotal * 0.15 * 100) / 100 }</Text>
                </Row>
                <Divider />
                <Row justify="space-between">
                    <Text b>Total</Text>
                    <Text b>{ Math.round(Manager.subtotal * 1.15 * 100) / 100 }</Text>
                </Row>
            </Card>
            <Spacer y={1} />
            <Row justify="end" style={{ width: "100%" }}>
                <Button shadow type="secondary" onClick={ handleClick }>Checkout</Button>
            </Row>
        </Modal.Content>
    </Modal>
    const loading = <Modal width="80vw" {...bindings}>
        <Modal.Title>Panier</Modal.Title>
        <Modal.Content>
            <Lottie options={{
                loop: true,
                autoplay: true,
                animationData: animationData,
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice',
                },
            }} height={500} width={400} isClickToPauseDisabled={true} />
        </Modal.Content>
    </Modal>
    return checkout ? loading : modal
}