import { Text, AutoComplete, Row, Col, Spacer, Image, Page, Grid } from '@geist-ui/react'
import { Search } from '@geist-ui/react-icons'
import Head from 'next/head'
import { useState } from 'react'
import NavBar from '../components/NavBar'
import styles from '../styles/Home.module.scss'
import { graphQLClient } from '../utils/fauna'
import { AllProducts } from '../lib/Requests'
import pStyles from '../styles/ProductCard.module.scss'
import Link from 'next/link'
import ProductCard from '../components/ProductCard'
import { withRouter } from "next/router"
import Footer from '../components/Footer'

function Home({ products, router }) {
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

	const [options, setOptions] = useState()
	const [searching, setSearching] = useState(false)
	// triggered every time input

	const makeOption = (product) => (
		<AutoComplete.Option value={product.name}>
			<Link href="/product/[product]" as={ `/product/${product._id}` }>
				<div className={ pStyles.container } style={{ width: "70vw", padding: "10px 0" }}>
					<Image src={ `https://ik.imagekit.io/ittx2e0v7x/tr:n-media_library_thumbnail,fo-auto/${product.image}` } height={100} className={ pStyles.img } alt={ product.name }/>
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

	const searchHandler = async (currentValue) => {
		if (!currentValue) return setOptions([])
		setSearching(true)
		const Fuse = (await import('fuse.js')).default
		const fuse = new Fuse(products.filter(e => e.quantity >= 1), fuseOption)
		const relatedOptions = fuse.search(currentValue).map(entry => {
			return makeOption(entry.item)
		})
		// this is mock async request
		// you can get data in any way
		setOptions(relatedOptions)
		setSearching(false)
	}

	const submit = e => {
		e.preventDefault();
		const params = new URLSearchParams()
		params.set("search", document.getElementById("search").value)

		router.push(`/product/all?${params.toString()}`)
	}
	return (<>
	<Head>
		<title>La Seconde Cabane</title>
		<link rel="icon" href="/favicon.ico" />
		<meta name="description" content="Ma Seconde Cabane est un vide dressing de qualité au Québec pour les enfants" />
	</Head>
	<NavBar />
	<Grid.Container gap={ 4 } justify="center" alignItems="center" className={styles.header}>
		<Grid xs={ 24 } md={ 15 } className={ styles.search }>
			<div className={ styles.hero } />
			<Image width={ 259.81 } height={ 105 } src="/img/hanger.svg" alt="Cintre" />
			<Text h1 className={ styles.heroDesc }>
				Vide dressing de qualité pour les enfants
			</Text>
			<form onSubmit={ submit } style={{ width: "calc(100% - 50px)" }} method="get" action="/product/all">
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
				name="search"
				id="search">
					<AutoComplete.Empty>
						<span>Oups! Essayez autre chose...</span>
					</AutoComplete.Empty>
				</AutoComplete>
			</form>
		</Grid>
	</Grid.Container>
	<Grid.Container gap={4} justify="space-evenly" className={ styles.process }>
		<Grid xs={ 24 } md={ 6 }>
			<Image src="/img/you-sell.svg" width={400} height={400} className={ styles.image } alt="T-Shirt" />
			<Text h3 align="center">
				Vous vendez ce qui ne vous sert plus
			</Text>
		</Grid>
		<Grid xs={ 24 } md={ 6 }>
			<Image src="/img/we-put-online.svg" width={400} height={400} className={ styles.image } alt="Internet"/>
			<Text h3 align="center">
				On s’occupe de la mise en ligne
			</Text>
		</Grid>
		<Grid xs={ 24 } md={ 6 }>
			<Image src="/img/you-receive.svg" width={400} height={400} className={ styles.image } alt="Dollar" />
			<Text h3 align="center">
			Vous recevez l’argent.<br/>
			That’s it!
			</Text>
		</Grid>
	</Grid.Container>
	<Page>
		<Text h1>Nos derniers produits</Text>
		<Grid.Container gap={2} justify="flex-start">
			{
				products.filter(e => e.quantity >= 1).slice(0, 6).map(p => {
					return <Grid key={ p._id } xs={24} md={8}>
						<ProductCard product={ p } />
					</Grid>
				})
			}
		</Grid.Container>
	</Page>
	<Footer />
	</>
	)
}

export default withRouter(Home)

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