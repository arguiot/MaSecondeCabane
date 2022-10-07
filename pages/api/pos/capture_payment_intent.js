import { ProductByID, UpdateProduct } from '../../../lib/Requests';
import { graphQLServer } from '../../../utils/fauna';
import { verifyToken } from './connection_token';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

export default async (req, res) => {
    const body = req.body // Body is a JSON object
    const token = req.headers.authorization.split(" ")[1] // User should send the token in the Authorization: Bearer <token> header
    if (!verifyToken(token)) {
        return res.status(401).json({ error: "Invalid token" });
    }
    const intent = await stripe.paymentIntents.capture(body.payment_intent_id);
    // Update items in the database
    const items = body.items
    let articles = []
    for (var i = 0; i < items.length; i++) {
        try {
            const entry = items[i]
            const query = ProductByID
            const {
                findProductByID
            } = await graphQLServer.request(query, {
                id: entry.product
            })
            articles.push(findProductByID)
            const updateQuery = UpdateProduct
            const variables = {
                id: entry.product,
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
        } catch (err) {
            console.log(err)
        }
    }

    res.status(200).json({ intent });
}