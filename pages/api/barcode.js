const { DOMImplementation, XMLSerializer } = require('xmldom');
const JsBarcode = require('jsbarcode');

export default (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const id = url.searchParams.get("id")

    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    JsBarcode(svgNode, id, {
        xmlDocument: document,
    });
    
    const svgText = xmlSerializer.serializeToString(svgNode);

    res.statusCode = 200
    res.setHeader('Content-Type', 'image/svg+xml')
    res.end(svgText)
}