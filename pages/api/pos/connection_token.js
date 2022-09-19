const stripe = require('stripe')(process.env.STRIPE_SECRET);

export default async (req, res) => {
    const connectionToken = await stripe.terminal.connectionTokens.create();
    res.status(200).json({ secret: connectionToken });
}