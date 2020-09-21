import ImageKit from "imagekit"

const imagekit = new ImageKit({
    publicKey : "public_eJkpjNUfd/gm7cI1cWR6OEPz6GQ=",
    privateKey : "private_kq+P5G46Mb7l9RPoxAXNnCSp1/w=",
    urlEndpoint : "https://ik.imagekit.io/ittx2e0v7x"
});

const authenticationParameters = imagekit.getAuthenticationParameters();

export default (req, res) => {
    console.log("Getting Auth", authenticationParameters)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(authenticationParameters))
}