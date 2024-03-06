import { db } from "../db";
import { address, customer, order, orderProductLine, products, request, websiteConfig } from "../db/schema";

import backup from "../backup.json";
import { ExtractTablesWithRelations, sql } from "drizzle-orm";
import { MySqlTransaction } from "drizzle-orm/mysql-core";
import { PlanetScalePreparedQueryHKT, PlanetscaleQueryResultHKT } from "drizzle-orm/planetscale-serverless";

const pushData = async () => {
    // push product data
    console.log(`Pushing ${backup.products.length} products`);
    for (const product of backup.products) {
        await db.insert(products).values({
            ...product,
            _id: Number(product._id),
        }).execute();
    }

    // push order data
    console.log(`Pushing ${backup.orders.length} orders`);
    for (const _order of backup.orders) {
        await db.transaction(async (tx) => {
            await tx.insert(address).values(_order.customer.address);
            await tx.insert(customer).values({
                ..._order.customer,
                addressId: sql`LAST_INSERT_ID()`.mapWith(address._id),
            });
            const ord = await tx.insert(order).values({
                ..._order,
                customerId: sql`LAST_INSERT_ID()`.mapWith(customer._id),
                _id: Number(_order._id),
            }).returning({ insertId: order._id });
            for (const line of _order.line) {
                await tx.insert(orderProductLine).values({
                    orderId: Number(ord[0].insertId),
                    productId: Number(line.product),
                    quantity: line.quantity,
                });
            }
        })
    }

    // push request data
    console.log(`Pushing ${backup.requests.length} requests`);
    for (const _request of backup.requests) {
        await db.transaction(async (tx) => {
            await tx.insert(address).values(_request.customer.address);
            await tx.insert(customer).values({
                ..._request.customer,
                addressId: sql`LAST_INSERT_ID()`.mapWith(address._id),
            });
            await tx.insert(request).values({
                ..._request,
                customerId: sql`LAST_INSERT_ID()`.mapWith(customer._id),
                _id: Number(_request._id),
            });
        })
    }

    // push config data
    console.log(`Pushing ${backup.configs.length} configs`);
    for (const config of backup.configs) {
        await db.transaction(async (tx) => {
            await tx.insert(address).values(config.popUpAddress);
            await tx.insert(websiteConfig).values({
                ...config,
                popUpAddressId: sql`LAST_INSERT_ID()`.mapWith(address._id),
                promoFr: config.promo.fr,
                promoEn: config.promo.en,
                _id: Number(config._id),
            });
        })
    }
}

pushData();