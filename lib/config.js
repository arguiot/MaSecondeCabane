import { AllConfigs } from "../lib/Requests"
import { graphQLClient } from "../utils/fauna"

export default async function getConfig() {
    const response = await graphQLClient.request(AllConfigs, { size: 1 })
    const { data } = response.allConfigs
    return data[0]
}