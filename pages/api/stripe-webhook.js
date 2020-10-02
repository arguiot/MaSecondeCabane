import { CreateOrder } from '../../lib/Requests';
import { graphQLClient } from "../../utils/fauna"

const stripe = require('stripe')('sk_test_3nOsPQAD4eQ1WaBbh9H99gcf');

const endpointSecret = "whsec_q7N1GHYU1oZzevlwYlcVj3N2MqsSVKAj"

export default async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        // event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
        event = req.body
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`)
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Create Order
            const query = CreateOrder
            const variables = {
                data: {
                    stripeID: paymentIntent.id,
                    total: paymentIntent.amount / 100,
                    customer: {
                        email: paymentIntent.receipt_email,
                        firstName: paymentIntent.shipping.name.split(" ")[0],
                        lastName: paymentIntent.shipping.name.split(" ")[1],
                        telephone: "None", //paymentIntent.shipping.phone,
                        address: {
                            street: paymentIntent.shipping.address.line1,
                            city: paymentIntent.shipping.address.city,
                            zipCode: paymentIntent.shipping.address.postal_code,
                            country: `${paymentIntent.shipping.address.country}, ${paymentIntent.shipping.address.state}`
                        }
                    },
                    line: JSON.parse(paymentIntent.metadata.order).map(entry => {
                        return {
                            product: entry.id,
                            quantity: entry.quantity
                        }
                    })
                }
            }
            const { createOrder } = await graphQLClient.request(query, variables)
            console.log(`Created order: ${createOrder._id}`)
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log('PaymentMethod was attached to a Customer!');
            break;
            // ... handle other event types
        default:
            // Unexpected event type
            return res.status(400).end();
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({
        received: true
    });
}