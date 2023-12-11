import { ne, and, eq } from 'drizzle-orm';
import { db } from '..';
import * as schema from '../schema';

export async function allProducts({
    waitingForCollect = false
}: {
    waitingForCollect?: boolean
} = {}) {
    return await db.query.products.findMany({
        where: and(
            waitingForCollect ? undefined : ne(schema.products.waitingForCollect, true),
        )
    })
}

export async function productById(id: number) {
    return await db.query.products.findFirst({
        where: eq(schema.products._id, id)
    })
}