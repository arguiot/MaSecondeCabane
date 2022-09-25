import jwt from "jsonwebtoken"
import authKey from "../../utils/AuthKey_A6TR77KY67.p8"
export default async (req, res) => {
    const payload = {
        iat: Date.now() / 1000,
    }

    const header = {
        typ: 'JWT',
        alg: 'ES256',
    }


    payload.iss = "73CCF549YB" // Team ID
    header.kid = "A6TR77KY67"

    // if (result.domain) {
    //     payload.origin = result.domain
    // }

    payload.exp = Date.now() / 1000 + 15 * 60 // 15 mins

    const token = jwt.sign(payload, authKey, { header: header })

    res.end(token)
}