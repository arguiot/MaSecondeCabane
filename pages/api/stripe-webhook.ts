import bodyParser from "body-parser"
import sendgrid from "@sendgrid/mail"
import { db } from '../../db';
import { address, customer, order, orderProductLine, products } from '../../db/schema';
import { eq, sql, count, inArray } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = require('stripe')(process.env.STRIPE_SECRET);
sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK

// first we need to disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    },
}

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Run the middleware
    await runMiddleware(req, res, bodyParser.raw({ type: 'application/json' }))

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
        } catch (err: any) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
                expand: ["payment_intent"],
            });

            const paymentIntent = session.payment_intent;
            // Check that the order isn't already in DB
            const lines = await db.select({
                value: count()
            }).from(order).where(eq(order.stripeID, paymentIntent.id))
            if (lines.reduce((a, b) => a + b.value, 0) > 0) {
                return res.status(202).send(`Webhook Error: Stripe order already exists in DB`);
            }
            // Create Order
            const names = paymentIntent.shipping.name.split(" ")

            let items: {
                product: number;
                quantity: number;
            }[] = []

            if (paymentIntent.metadata.order) {
                items = JSON.parse(paymentIntent.metadata.order).map((entry: any) => {
                    return {
                        product: Number(entry.id),
                        quantity: entry.quantity
                    }
                })
            } else {
                const tmp: any = await new Promise((resolve, reject) => {
                    stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ['data.price.product'] }, (err: Error, lineItems: any) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(lineItems)
                    })
                })
                // console.error( { tmp } )
                items = tmp.data.map((entry: any) => {
                    return {
                        product: Number(entry.price.product.metadata.id),
                        quantity: entry.quantity
                    }
                }).filter((entry: any) => entry.product) // Make sure we don't have any empty entries
            }

            await db.transaction(async tx => {
                await tx.insert(address).values({
                    street: paymentIntent.shipping.address.line1,
                    city: paymentIntent.shipping.address.city,
                    zipCode: paymentIntent.shipping.address.postal_code,
                    country: `${paymentIntent.shipping.address.country}, ${paymentIntent.shipping.address.state}`
                });
                await tx.insert(customer).values({
                    email: paymentIntent.receipt_email || paymentIntent.charges.data[0].billing_details.email || "Inconnue",
                    firstName: names[0],
                    lastName: names.slice(1).join(" "),
                    telephone: "None", //paymentIntent.shipping.phone,
                    addressId: sql`LAST_INSERT_ID()`.mapWith(address._id),
                })
                const ord = await tx.insert(order).values({
                    stripeID: paymentIntent.id,
                    total: paymentIntent.amount / 100,
                    customerId: sql`LAST_INSERT_ID()`.mapWith(customer._id),
                    delivery: paymentIntent.metadata.delivery == "true",
                    done: false
                });
                for (const line of items) {
                    await tx.insert(orderProductLine).values({
                        orderId: Number(ord.insertId),
                        productId: line.product,
                        quantity: line.quantity,
                    })
                    await tx.update(products).set({
                        quantity: sql`${products.quantity} - ${line.quantity}`
                    }).where(eq(products._id, line.product))
                }
            })

            const articles = await db.select().from(products).where(inArray(products._id, items.map(item => item.product)))

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
                <li>Livraison: ${paymentIntent.metadata.delivery == "true" ? "Oui" : "Click & Collect"}</li>
                </ul>
                <h1>Contenu</h1>
                <ol>
                ${articles.map(article => (`
                <li> ${article.name}
                <ul>
                <li>Description: ${article.description}</li>
                <li>Prix: ${article.price}$</li>
                <li>Identifiant: <a href="https://masecondecabane.com/product/${article._id}">${article._id}</a></li>
                <li>Quantité: ${article.quantity}</li>
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
