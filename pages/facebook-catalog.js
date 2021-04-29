import React from 'react';
import {
  AllProducts
} from '../lib/Requests';
import {
  graphQLClient
} from '../utils/fauna';
import stringify from "csv-stringify/lib/sync"

const createCatalog = (products) => {
    const processed = products.map(p => {
        return {
            id: p._id,
            name: p.name,
            description: p.description,
            available: p.quantity >= 1 ? "in stock" : "out of stock",
            condition: p.etat == "Neuf" ? "new" : "used",
            price: `${p.price}.00 CAD`,
            link: `https://masecondecabane.com/product/${p._id}`,
            image: `https://images.masecondecabane.com/${p.image}?auto=format&w=750&q=75`,
            category: p.size.includes("moi") ? 182 : 1604
        }
    })

    return stringify(processed, {
        header: true,
        columns: [
            { key: 'id', header: 'id' }, 
            { key: 'name', header: 'title' },
            { key: 'description', header: 'description' },
            { key: 'available', header: "availability" },
            { key: 'condition', header: 'condition' },
            { key: 'price', header: 'price' },
            { key: 'link', header: 'link' },
            { key: 'image', header: 'image_link' },
            { key: 'name', header: 'brand' },
            { key: 'category', header: 'google_product_category'}
        ]
    })
}

const query = AllProducts

let result;

class FacebookCatalog extends React.Component {
  static async getInitialProps({
    res
  }) {
    if (typeof result == "undefined") {
      result = await graphQLClient.request(query, { size: 1000 })
      console.log("GraphQL query")
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.write(createCatalog(result.allProducts.data));
    res.end();
  }
}

export default FacebookCatalog;