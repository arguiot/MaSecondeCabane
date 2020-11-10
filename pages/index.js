import { Text, AutoComplete, Row, Col, Spacer, Image, Page, Grid, Divider } from '@geist-ui/react'
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
import { buildIndex, fuseOption, getDescription } from '../locales/Fuse'
// ES Modules syntax
import Unsplash, { toJson } from 'unsplash-js';
import React from "react";

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function Home({ products, router, photos, t }) {
	// Hero
	const [ image, setImage ] = React.useState()
	const [PRODUCTS, setProducts] = React.useState([])
	React.useEffect(() => {
		setImage(photos[Math.floor(Math.random() * photos.length)])
		setProducts(shuffle(products.filter(e => (e.quantity >= 1 && e.favorite == true))).slice(0, 6))
	}, [])
	// Search logic

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
						<Text p className={ pStyles.truncate }>{ getDescription(product, router.locale) }</Text>
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

		const index = buildIndex(products, router.locale)
		const fuse = new Fuse(index, fuseOption)
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
		<title>Ma Seconde Cabane</title>
		<link rel="icon" href="/favicon.ico" />
		<meta name="description" content={ t.metaDesc } />
	</Head>
	<NavBar />
	<Grid.Container gap={ 4 } justify="center" alignItems="center" className={styles.header}>
		{ image && <>
			<div className={ styles.hero } style={{
				background: `linear-gradient(rgba(0, 0, 0, .35), rgba(0, 0, 0, .35)), url("${image.url}")`,
				backgroundSize: "cover",
				backgroundPosition: "center"
			}}/>
			<Text small className={ styles.heroPhoto }>Photo de <a href={ `${image.link}?utm_source=ma_seconde_cabane&utm_medium=referral` }>{ image.user }</a> sur <a href="https://unsplash.com/?utm_source=ma_seconde_cabane&utm_medium=referral">Unsplash</a></Text>
			</>
		}
		<Grid xs={ 24 } md={ 15 } className={ styles.search }>
			{/* <Image width={ 150 } height={ 150 } src="/img/hanger.svg" alt="Cintre" /> */}
			<Text h1 className={ styles.heroDesc }>
				{ t.heroDesc }
			</Text>
			<form onSubmit={ submit } style={{ width: "calc(100% - 50px)" }} method="get" action="/product/all">
				<AutoComplete 
				className={ styles.searchbar } 
				size="large" 
				icon={<Search />} 
				placeholder={ t.searchPlaceholder } 
				clearable 
				width="100%" 
				searching={searching}
				options={options}
				onSearch={searchHandler}
				name="search"
				id="search">
					<AutoComplete.Empty>
						<span>{ t.searchError }</span>
					</AutoComplete.Empty>
				</AutoComplete>
			</form>
		</Grid>
	</Grid.Container>
	<Page>
		<Text h1>{ t.products }</Text>
		<Grid.Container gap={2} justify="flex-start">
			{
				PRODUCTS.map(p => {
					return <Grid key={ p._id } xs={24} md={8}>
						<ProductCard key={ p._id } product={ p } />
					</Grid>
				})
			}
		</Grid.Container>
	</Page>
	<Divider type="dark" />
	<Spacer y={2} />
	<Grid.Container gap={4} justify="space-evenly" className={ styles.process }>
		<Grid xs={ 24 } md={ 4 }>
			<Image src="/img/selection.svg" width={400} height={400} className={ styles.image } alt="Selection" />
			<Text h5 align="center">
				{ t.selection }
			</Text>
		</Grid>
		<Grid xs={ 24 } md={ 4 }>
			<Image src="/img/fast.svg" width={400} height={400} className={ styles.image } alt="Rapidité"/>
			<Text h5 align="center">
				{ t.fastShipping }
			</Text>
		</Grid>
		<Grid xs={ 24 } md={ 4 }>
			<Image src="/img/safe.svg" width={400} height={400} className={ styles.image } alt="Securité" />
			<Text h5 align="center">
				{ t.safePayment }
			</Text>
		</Grid>
		<Grid xs={ 24 } md={ 4 }>
			<Image src="/img/environment.svg" width={400} height={400} className={ styles.image } alt="Protection" />
			<Text h5 align="center">
				{ t.firstChoice }
			</Text>
		</Grid>
	</Grid.Container>
	<Footer />
	</>
	)
}

export default withRouter(Home)

import Locales from "../locales/index"

export async function getStaticProps({ locale }) {
	const unsplash = new Unsplash({ accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS });
	const collection = await unsplash.collections.getCollectionPhotos(27372549).then(toJson)
	const photos = collection.map(photo => {
		return {
			url: `${photo.urls.raw}&auto=format&w=1024&q=70`,
			link: photo.links.html,
			user: photo.user.name
		}
	})

	const query = AllProducts
	const result = await graphQLClient.request(query)
	
	// Locales
	const locales = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][locale.split("-")[0]]
	]))

    return {
        props: {
			products: result.allProducts.data,
			photos,
			t: locales
        },
        revalidate: 300
    }
}