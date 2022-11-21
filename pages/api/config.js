import getConfig from "../../lib/config"

export default async (req, res) => {
    // Get the config
    const config = await getConfig()
    // Return the config
    res.status(200).json(config)
}