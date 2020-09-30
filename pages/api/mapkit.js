const jwt = require('jsonwebtoken');
const fs = require('fs')
export default (req, res) => {
    const privateKey = fs.readFileSync(process.cwd() + '/utils/AuthKey_5AGSLW2SKZ.p8');
    const token = jwt.sign({
        iss: "73CCF549YB"
    }, privateKey, {
        algorithm: "ES256",
        keyid: "5AGSLW2SKZ"
    })
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(token)
}