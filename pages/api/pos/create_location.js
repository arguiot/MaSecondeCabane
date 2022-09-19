const stripe = require('stripe')(process.env.STRIPE_SECRET);

export default async (req, res) => {
    // Get location object from request body
    const body = JSON.parse(req.body)
    // Create location
    const location = await stripe.terminal.locations.create(body);

    res.status(200).json({ location });
}