import React from 'react';
import { allProducts } from '../db/requests/products';

const createSitemap = (products) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
        ${products
    .map(({ _id }) => {
      return `
                    <url>
                        <loc>https://masecondecabane.com/product/${_id}</loc>
                        <xhtml:link 
                          rel="alternate"
                          hreflang="fr-CA"
                          href="https://masecondecabane.com/fr-CA/product/${_id}"/>
                        <xhtml:link 
                          rel="alternate"
                          hreflang="en-CA"
                          href="https://masecondecabane.com/en-CA/product/${_id}"/>
                        <xhtml:link 
                          rel="alternate"
                          hreflang="x-default"
                          href="https://masecondecabane.com/product/${_id}"/>
                    </url>
                `;
    })
    .join('')}
          <url>
            <loc>https://masecondecabane.com/</loc>
            <xhtml:link 
               rel="alternate"
               hreflang="fr-CA"
               href="https://masecondecabane.com/fr-CA"/>
            <xhtml:link 
            rel="alternate"
            hreflang="en-CA"
            href="https://masecondecabane.com/en-CA"/>
            <xhtml:link 
            rel="alternate"
            hreflang="x-default"
            href="https://masecondecabane.com/"/>
          </url>
          <url>
            <loc>https://masecondecabane.com/privacy</loc>
            <xhtml:link 
               rel="alternate"
               hreflang="fr-CA"
               href="https://masecondecabane.com/fr-CA/privacy"/>
            <xhtml:link 
            rel="alternate"
            hreflang="en-CA"
            href="https://masecondecabane.com/en-CA/privacy"/>
            <xhtml:link 
            rel="alternate"
            hreflang="x-default"
            href="https://masecondecabane.com/privacy"/>
          </url>
          <url>
            <loc>https://masecondecabane.com/about</loc>
            <xhtml:link 
               rel="alternate"
               hreflang="fr-CA"
               href="https://masecondecabane.com/fr-CA/about"/>
            <xhtml:link 
            rel="alternate"
            hreflang="en-CA"
            href="https://masecondecabane.com/en-CA/about"/>
            <xhtml:link 
            rel="alternate"
            hreflang="x-default"
            href="https://masecondecabane.com/about"/>
          </url>
          <url>
            <loc>https://masecondecabane.com/product/sell</loc>
            <xhtml:link 
               rel="alternate"
               hreflang="fr-CA"
               href="https://masecondecabane.com/fr-CA/product/sell"/>
            <xhtml:link 
            rel="alternate"
            hreflang="en-CA"
            href="https://masecondecabane.com/en-CA/product/sell"/>
            <xhtml:link 
            rel="alternate"
            hreflang="x-default"
            href="https://masecondecabane.com/product/sell"/>
          </url>
    </urlset>
    `;

let result;

class Sitemap extends React.Component {
  static async getInitialProps({
    res
  }) {
    if (typeof result == "undefined") {
      result = await allProducts()
    }
    res.setHeader('Content-Type', 'text/xml');
    res.write(createSitemap(result));
    res.end();
  }
}

export default Sitemap;