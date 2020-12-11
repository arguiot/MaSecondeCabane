const stripe = require('stripe')(process.env.STRIPE_SECRET);

const YOUR_DOMAIN = 'https://masecondecabane.com/checkout';
// const YOUR_DOMAIN = 'http://localhost:3000/checkout';

export default async (req, res) => {
    const body = JSON.parse(req.body)
    
    const items = body.map(entry => {
        return {
            price_data: {
                currency: 'cad',
                product_data: {
                    name: entry.name,
                    images: [`https://images.masecondecabane.com/${entry.image}?auto=compress&w=150&h=150&fit=crop`],
                },
                unit_amount: Math.round(entry.price * (100 + 5 + 9.975)) + 900, // VAT + Delivery
            },
            quantity: entry.quantity,
        }
    })

    const metadata = {
        "order": JSON.stringify(body.map(product => {
            return {
                id: product._id,
                quantity: product.quantity
            }
        }))
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items,
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        shipping_address_collection: {
            allowed_countries: ['CA'],
        },
        allow_promotion_codes: true,
        payment_intent_data: { metadata }
    });
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
        id: session.id
    }))
}