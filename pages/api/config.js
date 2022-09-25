import { AllConfigs } from "../../lib/Requests"
import { graphQLClient } from "../../utils/fauna"

export default async (req, res) => {
    const response = await graphQLClient.request(AllConfigs, { size: 1 })
    const { data } = response.allConfigs
    res.status(200).json(data[0])
}