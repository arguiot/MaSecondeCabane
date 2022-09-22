import { ProductByID } from "../../../../lib/Requests"
import { graphQLClient } from "../../../../utils/fauna"
import { verifyToken } from "../connection_token";

export default async (req, res) => {
    const token = req.headers.authorization.split(" ")[1] // User should send the token in the Authorization: Bearer <token> header
    if (!verifyToken(token)) {
        return res.status(401).json({ error: "Invalid token" });
    }
    const { product } = req.query
    const query = ProductByID
    const { findProductByID } = await graphQLClient.request(query, {
        id: product
    })
    res.status(200).json(findProductByID)
}