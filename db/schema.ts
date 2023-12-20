import { index, int, text, varchar, mysqlTable, boolean, float, json } from 'drizzle-orm/mysql-core';
import { moment } from './types/moment';
import { ID, dID } from './types/ID';
import { relations } from 'drizzle-orm';

export const products = mysqlTable('Products', {
    _id: ID('id').autoincrement().primaryKey(),
    _ts: moment('ts').notNull().$defaultFn(() => new Date().getTime() * 1000),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    descriptionEn: text('descriptionEn'),
    price: int('price').notNull(),
    boughtPrice: int('boughtPrice'),
    waitingForCollect: boolean('waitingForCollect'),
    quantity: int('quantity').notNull(),
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

export const address = mysqlTable('Address', {
    _id: ID('id').autoincrement().primaryKey(),
    street: varchar('street', { length: 255 }).notNull(),
    city: varchar('city', { length: 255 }).notNull(),
    country: varchar('country', { length: 255 }).notNull(),
    zipCode: varchar('zipCode', { length: 20 }).notNull(),
}, (table) => {
    return {
        addressIdx: index("address_idx").on(table._id),
    }
});

export const customer = mysqlTable('Customer', {
    _id: ID('id').autoincrement().primaryKey(),
    firstName: varchar('firstName', { length: 255 }).notNull(),
    lastName: varchar('lastName', { length: 255 }).notNull(),
    addressId: ID('addressId').references(() => address._id).notNull(),
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

export const request = mysqlTable('Request', {
    _id: ID('id').autoincrement().primaryKey(),
    _ts: moment('ts').notNull().$defaultFn(() => new Date().getTime() * 1000),
    customerId: dID('customerId').references(() => customer._id).notNull(),
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

export const order = mysqlTable('Order', {
    _id: ID('id').autoincrement().primaryKey(),
    _ts: moment('ts').notNull().$defaultFn(() => new Date().getTime() * 1000),
    customerId: dID('customerId').references(() => customer._id).notNull(),
    stripeID: varchar('stripeID', { length: 255 }).notNull(),
    total: float('total').notNull(),
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

export const orderProductLine = mysqlTable('OrderProductLine', {
    _id: ID('id').autoincrement().primaryKey(),
    orderId: dID('orderId').references(() => order._id).notNull(),
    productId: dID('productId').references(() => products._id).notNull(),
    quantity: int('quantity').notNull(),
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

export const websiteConfig = mysqlTable('WebsiteConfig', {
    _id: ID('id').autoincrement().primaryKey(),
    locked: boolean('locked').notNull(),
    popUpAddressId: ID('popUpAddressId').references(() => address._id),
    freeShipping: int('freeShipping').notNull(),
    delayDelivery: varchar('delayDelivery', { length: 255 }),
    promoFr: varchar('promoFr', { length: 255 }).notNull(),
    promoEn: varchar('promoEn', { length: 255 }).notNull(),
});

export const websiteConfigRelation = relations(websiteConfig, ({ one, many }) => ({
    popUpAddress: one(address, {
        fields: [websiteConfig.popUpAddressId],
        references: [address._id],
    }),
}));