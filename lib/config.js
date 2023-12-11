import { db } from "../db"
import { websiteConfig } from "../db/schema"

export default async function getConfig() {
    const response = await db.select().from(websiteConfig).limit(1).execute()
    response[0].promo = {
        fr: response[0].promoFr,
        en: response[0].promoEn
    }
    return response[0]
}