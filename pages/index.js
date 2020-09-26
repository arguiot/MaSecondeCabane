import { Text, AutoComplete, Row, Col, Spacer, Image, Page, Grid } from '@geist-ui/react'
import { Search } from '@geist-ui/react-icons'
import Head from 'next/head'
import { useState } from 'react'
import NavBar from '../components/NavBar'
import styles from '../styles/Home.module.scss'
import { graphQLClient } from '../utils/fauna'
import { AllProducts } from '../lib/Requests'
import Fuse from 'fuse.js'
import pStyles from '../styles/ProductCard.module.scss'
import Link from 'next/link'
import ProductCard from '../components/ProductCard'

export default function Home({ products }) {
	// Search logic

	const fuseOption = {
		includeScore: true,
		// Search in `author` and in `tags` array
		keys: [
			"name",
			"description",
			"sexe",
			"size",
			"brand",
			"etat",
			"tags"
		]
	}

	const fuse = new Fuse(products.filter(e => e.quantity >= 1), fuseOption)

	const [options, setOptions] = useState()
	const [searching, setSearching] = useState(false)
	// triggered every time input

	const makeOption = (product) => (
		<AutoComplete.Option value={product.name}>
			<Link href="/product/[product]" as={ `/product/${product._id}` }>
				<div className={ pStyles.container } style={{ width: "70vw", padding: "10px 0" }}>
					<Image src={ `https://ik.imagekit.io/ittx2e0v7x/tr:n-media_library_thumbnail,fo-auto/${product.image}` } height={100} className={ pStyles.img }/>
					<Col className={ pStyles.desc }>
						<Text h5>{ product.name }</Text>
						<Text p className={ pStyles.truncate }>{ product.description }</Text>
					</Col>
					<Spacer x={2} />
					<Col span={3}>
						<Row align="middle" style={{ height: '100%' }}>
							<Text h5>{ product.price }$</Text>
						</Row>
					</Col>
				</div>
			</Link>
		</AutoComplete.Option>
	  )

	const searchHandler = (currentValue) => {
		if (!currentValue) return setOptions([])
		setSearching(true)
		const relatedOptions = fuse.search(currentValue).map(entry => {
			return makeOption(entry.item)
		})
		// this is mock async request
		// you can get data in any way
		setOptions(relatedOptions)
		setSearching(false)
	}
	return (<>
	<Head>
		<title>La Seconde Cabane</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
	<header className={styles.header}>
		<Text h1 className={ styles.heroDesc }>
			Vide dressing de qualité pour les enfants
		</Text>
		<div style={{ width: "80%" }}>
			<AutoComplete 
			className={ styles.searchbar } 
			size="large" 
			icon={<Search />} 
			placeholder="Essayez “manteau en 5 ans”" 
			clearable 
			width="100%" 
			searching={searching}
			options={options}
			onSearch={searchHandler}
			/>
		</div>
	</header>
	<Page>
		<Text h1>Nos derniers produits</Text>
		<Grid.Container gap={2} justify="flex-start">
			{
				products.filter(e => e.quantity >= 1).slice(0, 6).map(p => {
					return <Grid xs={24} md={8}>
						<ProductCard product={ p } />
					</Grid>
				})
			}
		</Grid.Container>
	</Page>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nyfonts@1.0.0/stylesheet.min.css">
	</link>
	</>
	)
}

export async function getStaticProps() {
	const query = AllProducts
    const result = await graphQLClient.request(query)
    return {
        props: {
            products: result.allProducts.data
        },
        revalidate: 300
    }
}