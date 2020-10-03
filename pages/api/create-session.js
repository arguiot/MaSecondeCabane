const stripe = require('stripe')('sk_test_3nOsPQAD4eQ1WaBbh9H99gcf');

// const YOUR_DOMAIN = 'https://store.arguiot.vercel.app/checkout';
const YOUR_DOMAIN = 'http://localhost:3000/checkout';

export default async (req, res) => {
    const body = JSON.parse(req.body)
    
    const items = body.map(entry => {
        return {
            price_data: {
                currency: 'cad',
                product_data: {
                    name: entry.name,
                    images: [`https://ik.imagekit.io/ittx2e0v7x/tr:n-media_library_thumbnail/${entry.image}`],
                },
                unit_amount: Math.round(entry.price * 115), // VAT
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