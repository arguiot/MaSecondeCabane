import { AllProducts } from "../../../../lib/Requests"
import { graphQLClient } from "../../../../utils/fauna"
import { verifyToken } from "../connection_token";

export default async (req, res) => {
    const token = req.headers.authorization.split(" ")[1] // User should send the token in the Authorization: Bearer <token> header
    if (!verifyToken(token)) {
        return res.status(401).json({ error: "Invalid token" });
    }
    const query = AllProducts
    const { allProducts } = await graphQLClient.request(query, {
        size: 10000
    })
    // Filter out the products that are not available
    const products = allProducts.data.filter(product => {
        // If the product is waiting for collect, it is not available
        if (product.waitingForCollect == true) return false
        // If the product is not in stock, it is not available
        if (product.quantity < 1) return false
        return true
    })
    res.status(200).json(products)
}