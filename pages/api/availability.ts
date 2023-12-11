import { db } from "../../db";
import { products } from "../../db/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { inArray } from "drizzle-orm";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const schema = z.object({
        ids: z.array(z.number())
    });
    try {
        const ids = schema.parse(JSON.parse(req.body));

        const results = await db.select({
            _id: products._id,
            quantity: products.quantity,
        }).from(products).where(inArray(products._id, ids.ids));

        const quantities = Object.fromEntries(results.map(r => [r._id, r.quantity]));
        return res.status(200).json({ quantities });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Invalid request" });
    }
}