import { verifyToken } from './connection_token';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

export default async (req, res) => {
    const body = req.body // Body is a JSON object
    const token = req.headers.authorization.split(" ")[1] // User should send the token in the Authorization: Bearer <token> header
    if (!verifyToken(token)) {
        return res.status(401).json({ error: "Invalid token" });
    }
    const intent = await stripe.paymentIntents.capture(body.payment_intent_id);
    res.status(200).json({ intent });
}