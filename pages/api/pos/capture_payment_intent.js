const stripe = require('stripe')(process.env.STRIPE_SECRET);

export default async (req, res) => {
    const body = JSON.parse(req.body)
    const intent = await stripe.paymentIntents.capture(body.payment_intent_id);
    res.status(200).json({ intent });
}