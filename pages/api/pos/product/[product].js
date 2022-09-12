import { ProductByID } from "../../../../lib/Requests"
import { graphQLClient } from "../../../../utils/fauna"

export default async (req, res) => {
    const { product } = req.query
    const query = ProductByID
    const { findProductByID } = await graphQLClient.request(query, {
        id: product
    })
    res.status(200).json(findProductByID)
}