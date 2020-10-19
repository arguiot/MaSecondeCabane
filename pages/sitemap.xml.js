import React from 'react';
import { AllProducts } from '../lib/Requests';
import { graphQLClient } from '../utils/fauna';

const createSitemap = (products) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${products
          .map(({ _id }) => {
            return `
                    <url>
                        <loc>https://masecondecabane.com/product/${_id}</loc>
                    </url>
                `;
          })
          .join('')}
          <url>
            <loc>https://masecondecabane.com/</loc>
          </url>
          <url>
            <loc>https://masecondecabane.com/privacy</loc>
          </url>
          <url>
            <loc>https://masecondecabane.com/about</loc>
          </url>
          <url>
            <loc>https://masecondecabane.com/product/sell</loc>
          </url>
    </urlset>
    `;

class Sitemap extends React.Component {
    static async getInitialProps({
        res
    }) {
        const query = AllProducts
        const result = await graphQLClient.request(query)

        res.setHeader('Content-Type', 'text/xml');
        res.write(createSitemap(result.allProducts.data));
        res.end();
    }
}

export default Sitemap;