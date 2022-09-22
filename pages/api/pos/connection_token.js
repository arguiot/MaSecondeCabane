const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { createHash } = require('crypto');

export function verifyToken(token) {
    const hash = createHash('sha256');
    const secret = process.env.POS_TOKEN
    hash.update(secret)
    const hashedToken = hash.digest('hex');
    return hashedToken == token;
}

export default async (req, res) => {
    const token = req.headers.authorization.split(" ")[1] // User should send the token in the Authorization: Bearer <token> header
    if (!verifyToken(token)) {
        return res.status(401).json({ error: "Invalid token" });
    }
    const connectionToken = await stripe.terminal.connectionTokens.create();
    res.status(200).json({ secret: connectionToken });
}