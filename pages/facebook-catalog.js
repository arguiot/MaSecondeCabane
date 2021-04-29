import React from 'react';
import {
	AllProducts
} from '../lib/Requests';
import {
	graphQLClient
} from '../utils/fauna';
import stringify from "csv-stringify/lib/sync"
import { getSize } from '../locales/Fuse';

const createCatalog = (products, lang) => {
		function ageGroup(size) {
			if (size == "0 mois" || size == "1 mois") return "newborn"
			if (size.includes("mois")) return "infant"
			if (size == "2 ans" || size == "3 ans") return "toddler"

			return "kids"
		}
		const processed = products.map(p => {
				return {
						id: p._id,
						name: p.name,
						description: lang == "fr-CA" ? p.description : p.descriptionEn,
						available: p.quantity >= 1 ? "in stock" : "out of stock",
						condition: p.etat == "Neuf" ? "new" : "used",
						price: `${p.price}.00 CAD`,
						link: `https://masecondecabane.com/${lang}/product/${p._id}`,
						image: `https://images.masecondecabane.com/${p.image}?auto=format&w=750&q=75`,
						category: p.size.includes("moi") ? 182 : 1604,
						age: ageGroup(p.size),
						gender: p.sexe == "Mixte" ? "unisex" : (p.sexe == "Fille" ? "female" : "male"),
						size: getSize(p.size, lang)
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
						{ key: 'category', header: 'google_product_category'},
						{ key: 'age', header: 'age_group' },
						{ key: 'gender', header: 'gender' },
						{ key: 'size', header: 'size' }
				]
		})
}

const query = AllProducts

let result;

export default class FacebookCatalog extends React.Component {}

export async function getServerSideProps({ res, locale }) {
	if (typeof result == "undefined") {
		result = await graphQLClient.request(query, { size: 1000 })
		console.log("GraphQL query")
	}
	res.setHeader('Content-Type', 'text/csv; charset=utf-8');
	res.write(createCatalog(result.allProducts.data, locale));
	res.end();
	return {
		props: {}, // will be passed to the page component as props
	}
}