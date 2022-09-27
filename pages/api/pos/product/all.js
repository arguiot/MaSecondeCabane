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
    res.status(200).json(allProducts.data)
}