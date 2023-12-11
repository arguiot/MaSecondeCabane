import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './connection_token';
import { products } from '../../../db/schema';
import { db } from '../../../db';
import { sql, eq } from 'drizzle-orm';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body // Body is a JSON object
    const token = req.headers.authorization?.split(" ")[1] // User should send the token in the Authorization: Bearer <token> header
    if (!token || !verifyToken(token)) {
        return res.status(401).json({ error: "Invalid token" });
    }
    const intent = await stripe.paymentIntents.capture(body.payment_intent_id);
    // Update items in the database
    const items = body.items

    await db.transaction(async (tx) => {
        for (var i = 0; i < items.length; i++) {
            await tx.update(products)
                .set({
                    waitingForCollect: false,
                    quantity: sql`${products.quantity} - ${items[i].quantity}`
                })
                .where(eq(products._id, items[i].product))
        }
    })

    res.status(200).json({ intent });
}