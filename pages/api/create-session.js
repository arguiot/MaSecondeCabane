const stripe = require('stripe')(process.env.STRIPE_SECRET);

const YOUR_DOMAIN = 'https://masecondecabane.com/checkout';
// const YOUR_DOMAIN = 'http://localhost:3000/checkout';

export default async (req, res) => {
    const body = JSON.parse(req.body)
    
    const deliveryPrice = price => {
        return (price >= 40) ? 0 : 900
    }

    const items = body.cart.map(entry => {
        return {
            price_data: {
                currency: 'cad',
                product_data: {
                    name: entry.name,
                    images: [`https://images.masecondecabane.com/${entry.image}?auto=compress&w=150&h=150&fit=crop`],
                },
                unit_amount: Math.round(entry.price * (100 + 5 + 9.975)), // VAT
            },
            quantity: entry.quantity,
        }
    })

    if (body.delivery) {
        const price = deliveryPrice(body.cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0))
        if (price > 0) {
            items.push({
                price_data: {
                    currency: 'cad',
                    product_data: {
                        name: 'Delivery',
                        images: [`https://images.masecondecabane.com/delivery.jpg?auto=compress&w=150&h=150&fit=crop`],
                    },
                    // Calculate sum of all articles
                    unit_amount: price,
                },
                quantity: 1,
            })
        }
    }

    const metadata = {
        order: JSON.stringify(body.cart.map(product => {
            return {
                id: product._id,
                quantity: product.quantity
            }
        })),
        delivery: String(body.delivery)
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