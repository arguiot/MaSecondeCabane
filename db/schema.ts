import { index, integer, text, varchar, boolean, doublePrecision, json, pgSchema } from 'drizzle-orm/pg-core';
import { moment } from './types/moment';
import { ID, dID } from './types/ID';
import { relations } from 'drizzle-orm';

export const masecondecabane = pgSchema("masecondecabane")

export const products = masecondecabane.table('products', {
    _id: ID('id').primaryKey(),
    _ts: moment('ts').notNull().$defaultFn(() => new Date().getTime() * 1000),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    descriptionEn: text('descriptionen'),
    price: integer('price').notNull(),
    boughtPrice: integer('boughtprice'),
    waitingForCollect: boolean('waitingforcollect'),
    quantity: integer('quantity').notNull(),
    image: varchar('image', { length: 255 }).notNull(),
    sexe: varchar('sexe', { length: 255 }).notNull(),
    size: varchar('size', { length: 255 }).notNull(),
    brand: varchar('brand', { length: 255 }).notNull(),
    etat: varchar('etat', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    tags: json('tags').$type<string[]>(),
    creation: moment('creation').notNull(),
    favorite: boolean('favorite').notNull(),
    composition: json('composition').$type<string[]>(),
}, (table) => {
    return {
        productsIdx: index("products_idx").on(table._id),
    }
});

export const address = masecondecabane.table('address', {
    _id: ID('id').primaryKey(),
    street: varchar('street', { length: 255 }).notNull(),
    city: varchar('city', { length: 255 }).notNull(),
    country: varchar('country', { length: 255 }).notNull(),
    zipCode: varchar('zipcode', { length: 20 }).notNull(),
}, (table) => {
    return {
        addressIdx: index("address_idx").on(table._id),
    }
});

export const customer = masecondecabane.table('customer', {
    _id: ID('id').primaryKey(),
    firstName: varchar('firstname', { length: 255 }).notNull(),
    lastName: varchar('lastname', { length: 255 }).notNull(),
    addressId: ID('addressid').references(() => address._id).notNull(),
    telephone: varchar('telephone', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
}, (table) => {
    return {
        customerIdx: index("customer_idx").on(table._id),
    }
});

export const customerRelation = relations(customer, ({ one, many }) => ({
    address: one(address, {
        fields: [customer.addressId],
        references: [address._id],
    }),
}));

export const request = masecondecabane.table('request', {
    _id: ID('id').primaryKey(),
    _ts: moment('ts').notNull().$defaultFn(() => new Date().getTime() * 1000),
    customerId: dID('customerid').references(() => customer._id).notNull(),
    description: text('description').notNull(),
    done: boolean('done'),
}, (table) => {
    return {
        requestIdx: index("request_idx").on(table._id),
    }
});

export const requestRelation = relations(request, ({ one, many }) => ({
    customer: one(customer, {
        fields: [request.customerId],
        references: [customer._id],
    }),
}));

export const order = masecondecabane.table('order', {
    _id: ID('id').primaryKey(),
    _ts: moment('ts').notNull().$defaultFn(() => new Date().getTime() * 1000),
    customerId: dID('customerid').references(() => customer._id).notNull(),
    stripeID: varchar('stripeid', { length: 255 }).notNull(),
    total: doublePrecision('total').notNull(),
    done: boolean('done'),
    delivery: boolean('delivery').notNull().default(false),
}, (table) => {
    return {
        orderIdx: index("order_idx").on(table._id),
    }
});

export const orderRelation = relations(order, ({ one, many }) => ({
    customer: one(customer, {
        fields: [order.customerId],
        references: [customer._id],
    }),
    line: many(orderProductLine),
}));

export const orderProductLine = masecondecabane.table('OrderProductLine', {
    _id: ID('id').primaryKey(),
    orderId: dID('orderid').references(() => order._id).notNull(),
    productId: dID('productid').references(() => products._id).notNull(),
    quantity: integer('quantity').notNull(),
}, (table) => {
    return {
        orderProductLineIdx: index("orderProductLine_idx").on(table._id),
    }
});

export const orderProductLineRelation = relations(orderProductLine, ({ one, many }) => ({
    order: one(order, {
        fields: [orderProductLine.orderId],
        references: [order._id],
    }),
    product: one(products, {
        fields: [orderProductLine.productId],
        references: [products._id],
    }),
}));

export const websiteConfig = masecondecabane.table('websiteconfig', {
    _id: ID('id').primaryKey(),
    locked: boolean('locked').notNull(),
    popUpAddressId: ID('popupaddressid').references(() => address._id),
    freeShipping: integer('freeshipping').notNull(),
    delayDelivery: varchar('delaydelivery', { length: 255 }),
    promoFr: varchar('promofr', { length: 255 }).notNull(),
    promoEn: varchar('promoen', { length: 255 }).notNull(),
});

export const websiteConfigRelation = relations(websiteConfig, ({ one, many }) => ({
    popUpAddress: one(address, {
        fields: [websiteConfig.popUpAddressId],
        references: [address._id],
    }),
}));