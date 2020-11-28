import { Page, Select, Grid, Text, Description, Spacer, Input, Pagination, Row } from "@geist-ui/react"
import { ChevronLeft, ChevronRight, Search, X } from "@geist-ui/react-icons"
import Head from "next/head"
import NavBar from "../../components/NavBar"
import { graphQLClient } from '../../utils/fauna'
import { AllProducts } from '../../lib/Requests'
import ProductCard from '../../components/ProductCard'
import Fuse from 'fuse.js'
import { withRouter } from 'next/router'
import Footer from "../../components/Footer"
import { buildIndex, fuseOption, getCategory, getSize } from "../../locales/Fuse"
import React from "react";
import styles from "../../styles/All.module.scss"

function AllPage({ products, router, t }) {
    const [search, setSearch] = React.useState(router.query.search)
    const [sexe, setSexe] = React.useState(router.query.gender)
    React.useEffect(() => {
        const handleRoute = () => {
            const params = new URLSearchParams(window.location.search)
            setSexe(params.get("gender"))
            setSearch(params.get("search"))
        }

        router.events.on('routeChangeComplete', handleRoute)

        handleRoute()

        return () => {
            router.events.off('routeChangeComplete', handleRoute)
        }
    }, [])

    const [size, setSize] = React.useState([])
    const sizeList = [
        "0 mois", "1 mois", "3 mois", "6 mois", "9 mois", "12 mois", "18 mois",
        "2 ans", "3 ans", "4 ans", "5 ans", "6 ans", "7 ans", "8 ans", "9 ans", "10 ans", "11 ans", "12 ans"
    ]
    const [etat, setEtat] = React.useState([])
    const [category, setCategory] = React.useState([])
    const categoryList = [
        "Accessoires",
        "Chaussures",
        "Chemises, T-shirts & Blouses",
        "Gilets, Pulls & Sweat Shirts",
        "Pantalons, Jupes & Shorts",
        "Pyjamas & Bodies",
        "Robes & Combinaisons",
        "Vestes, Manteaux & Doudounes"
    ]

    // Search logic
    const [page, setPage] = React.useState(0)

    const fuse = new Fuse([], fuseOption)
    
    function results(search, sexe, size, etat) {
        const prdcts = products.filter(p => {
            // Quantite
            if (p.quantity < 1) {
                return false
            }
            // Filtres
            if (p.sexe != "Mixte" && p.sexe != sexe && typeof sexe == "string") {
                return false
            }
            if (p.size != "N/A" && !size.includes(p.size) && size.length > 0) {
                return false
            }
            if (!category.includes(p.type) && category.length > 0) {
                return false
            }
            if (!etat.includes(p.etat) && etat.length > 0) {
                return false
            }
            return true
        })

        const index = buildIndex(prdcts, router.locale)
        fuse.setCollection(index)
        
        if (typeof search == "string" && search != "") {
            return fuse.search(search).map(e => e.item)
        }

        return prdcts
    }

    function selectOption(label, value, hidden) {
        if (value.includes(label) || value.includes(hidden)) {
            return <Row justify="space-between" align="middle">
                <Text>{label}</Text>
                <X size={16} className={ styles.icon }/>
            </Row>
        }
        return label
    }

    const all = results(search, sexe, size, etat).map(p => {
        return <Grid xs={24} md={8}>
            <ProductCard product={ p } />
        </Grid>
    })
    React.useEffect(() => {
        if (Math.ceil(all.length  / 12) < page + 1) {
            setPage(0)
        }
    }, [all])

    return <>
	<Head>
		<title>Ma Seconde Cabane - { t.products }</title>
		<link rel="icon" href="/favicon.ico" />
        <meta name="description" content={ t.metaDescription } />
	</Head>
	<NavBar />
    <Page>
        <Grid.Container gap={2} justify="center">
            <Grid xs={24} md={6}>
                <Text h4>Filtres</Text>
                <Description title={ t.search } content={
                    <Input 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    icon={<Search />} 
                    placeholder={ t.brands } 
                    clearable 
                    width="100%" />
                }/>
                <Spacer y={.8}/>
                <Description title={ t.gender } content={
                    <Select placeholder={ t.gender } value={sexe} onChange={setSexe} width="100%" style={{ maxWidth: "none" }}>
                        <Select.Option value="Fille">{ t.girl }</Select.Option>
                        <Select.Option value="Garçon">{ t.boy }</Select.Option>
                    </Select>
                }/>
                <Spacer y={.8} />
                <Description title={ t.size } content={
                    <Select placeholder={ t.size } multiple width="100%" value={size} onChange={setSize} className={ styles.select }>
                        {
                            sizeList.map(s => <Select.Option value={s} className={ styles.selectOption }>{ selectOption(getSize(s, router.locale), size, s) }</Select.Option>)
                        }
                    </Select>
                }/>
                <Spacer y={.8} />
                <Description title={ t.condition } content={
                    <Select placeholder={ t.condition } multiple value={etat} onChange={setEtat} width="100%" className={ styles.select }>
                        <Select.Option value="Bon" className={ styles.selectOption }>{ selectOption(t.veryGood, etat, "Bon") }</Select.Option>
                        <Select.Option value="Excellent" className={ styles.selectOption }>{ selectOption(t.excellent, etat, "Excellent") }</Select.Option>
                        <Select.Option value="Neuf" className={ styles.selectOption }>{ selectOption(t.new, etat, "Neuf") }</Select.Option>
                    </Select>
                }/>
                <Spacer y={.8} />
                <Description title={ t.category } content={
                    <Select placeholder={ t.category } multiple width="100%" value={category} onChange={setCategory} className={ styles.select }>
                        {
                            categoryList.map(s => <Select.Option value={s} className={ styles.selectOption }>{ selectOption(getCategory(s, router.locale), category, s) }</Select.Option>)
                        }
                    </Select>
                }/>
            </Grid>
            <Grid xs={24} md={18}>
                <Grid.Container gap={2} justify="flex-start">
                    {
                        all.length == 0 ? <Text h4 type="secondary" align="center" style={{width: "100%"}}>{ t.searchError }</Text> : all.slice(page * 12, page * 12 + 12)
                    }
                    <Spacer y={2}/>
                    {
                        all.length > 0 && <Row justify="center" style={{ width: "100%" }}>
                        <Pagination count={ Math.ceil(all.length  / 12) } onChange={ n => { setPage(n - 1); window.scrollTo(0, 0) }} page={ page + 1 }>
                            <Pagination.Next><ChevronRight /></Pagination.Next>
                            <Pagination.Previous><ChevronLeft /></Pagination.Previous>
                        </Pagination>
                        </Row>
                    }
                </Grid.Container>
            </Grid>
        </Grid.Container>
    </Page>
    <Footer />
    </>
}

export default withRouter(AllPage)

import Locales from "../../locales/All"

export async function getStaticProps({ locale }) {
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
            t: locales
        },
        revalidate: 300
    }
}