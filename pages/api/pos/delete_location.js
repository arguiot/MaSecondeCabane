import { verifyToken } from './connection_token';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

export default async (req, res) => {
    const token = req.headers.authorization.split(" ")[1] // User should send the token in the Authorization: Bearer <token> header
    if (!verifyToken(token)) {
        return res.status(401).json({ error: "Invalid token" });
    }
    // Get id from request body
    const { id } = req.body;
    // Delete location
    const status = await stripe.terminal.locations.del(id);

    res.status(200).json(status);
}