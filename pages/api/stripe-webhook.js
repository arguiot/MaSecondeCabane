import {
    CreateOrder,
    ProductByID,
    UpdateProduct
} from '../../lib/Requests';
import {
    graphQLServer
} from "../../utils/fauna"
import bodyParser from "body-parser"
import sendgrid, { send } from "@sendgrid/mail"

const stripe = require('stripe')(process.env.STRIPE_SECRET);
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK

// first we need to disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    },
}

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}


export default async (req, res) => {
    // Run the middleware
    await runMiddleware(req, res, bodyParser.raw({type: 'application/json'}))
  
    let event;

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Create Order
            const names = paymentIntent.shipping.name.split(" ")
            const query = CreateOrder
            const variables = {
                data: {
                    stripeID: paymentIntent.id,
                    total: paymentIntent.amount / 100,
                    customer: {
                        email: paymentIntent.receipt_email || paymentIntent.charges.data[0].billing_details.email || "Inconnue",
                        firstName: names[0],
                        lastName: names.slice(1).join(" "),
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
                    }),
                    done: false
                }
            }
            const {
                createOrder
            } = await graphQLServer.request(query, variables)
            // Update Quantities
            const array = JSON.parse(paymentIntent.metadata.order)
            for (var i = 0; i < array.length; i++) {
                const entry = array[i]
                const query = ProductByID
                const {
                    findProductByID
                } = await graphQLServer.request(query, {
                    id: entry.id
                })
                const updateQuery = UpdateProduct
                const variables = {
                    id: entry.id,
                    data: {
                        name: findProductByID.name,
                        description: findProductByID.description,
                        price: findProductByID.price,
                        quantity: findProductByID.quantity - entry.quantity,
                        image: findProductByID.image,
                        creation: findProductByID.creation,
                        sexe: findProductByID.sexe,
                        size: findProductByID.size,
                        brand: findProductByID.brand,
                        etat: findProductByID.etat,
                        tags: findProductByID.tags,
                        favorite: findProductByID.favorite,
                        type: findProductByID.type,
                        composition: findProductByID.composition
                    }
                }
                const {
                    updateProduct
                } = await graphQLServer.request(updateQuery, variables)
                console.log(`Updated Product ${updateProduct._id}`)
            }

            const msg = {
                to: "contact@masecondecabane.com",
                from: "commandes@masecondecabane.com",
                replyTo: paymentIntent.receipt_email || paymentIntent.charges.data[0].billing_details.email,
                subject: `Nouvelle Commande pour ${paymentIntent.shipping.name}`,
                html: `
                <h1>Transaction</h1>
                <ul>
                <li>Montant: ${paymentIntent.amount / 100}</li>
                <li>Identifiant: <a href="https://dashboard.stripe.com/payments/${paymentIntent.id}">${paymentIntent.id}</a></li>
                </ul>
                <h1>Informations sur le client</h1>
                <ul>
                <li>Prénom, Nom: ${paymentIntent.shipping.name}</li>
                <li>Addresse: ${[paymentIntent.shipping.address.line1, paymentIntent.shipping.address.city, paymentIntent.shipping.address.postal_code, paymentIntent.shipping.address.country, paymentIntent.shipping.address.state].join(", ")}</li>
                </ul>
                <h1>Contenu</h1>
                <ol>
                ${array.map(article => (`
                <li>
                <ul>
                <li>Identifiant: <a href="https://masecondecabane.com/product/${article.id}">${article.id}</a></li>
                <li>Quantité: ${articly.quantity}</li>
                </ul>
                </li>
                `))}
                </ol>`
            }
        
            try {
                await sendgrid.send(msg);
            } catch (error) {
                console.error(error);
            }
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