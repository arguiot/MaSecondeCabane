import { Page, Select, Grid, Text, Description, Spacer, Input } from "@geist-ui/react"
import { Search } from "@geist-ui/react-icons"
import Head from "next/head"
import NavBar from "../../components/NavBar"
import { graphQLClient } from '../../utils/fauna'
import { AllProducts } from '../../lib/Requests'
import ProductCard from '../../components/ProductCard'
import Fuse from 'fuse.js'
import { withRouter } from 'next/router'
import Footer from "../../components/Footer"

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
            "tags",
            "type",
            "composition"
		]
	}

    const fuse = new Fuse([], fuseOption)
    
    function results(search, sexe, size, etat) {
        const prdcts = products.filter(p => {
            // Quantite
            if (p.quantity < 1) {
                return false
            }
            // Filtres
            if (p.sexe != sexe && typeof sexe == "string") {
                return false
            }
            if (!size.includes(p.size) && size.length > 0) {
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

        fuse.setCollection(prdcts)
        
        if (typeof search == "string" && search != "") {
            return fuse.search(search).map(e => e.item)
        }

        return prdcts
    }
    
    const all = results(search, sexe, size, etat).slice(0, 6).map(p => {
        return <Grid xs={24} md={8}>
            <ProductCard product={ p } />
        </Grid>
    })

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
                    <Select placeholder={ t.size } multiple width="100%" value={size} onChange={setSize} style={{ maxWidth: "none" }}>
                        {
                            sizeList.map(s => <Select.Option value={s}>{ getSize(s, router.locale) }</Select.Option>)
                        }
                    </Select>
                }/>
                <Spacer y={.8} />
                <Description title={ t.condition } content={
                    <Select placeholder={ t.condition } multiple value={etat} onChange={setEtat} width="100%" style={{ maxWidth: "none" }}>
                        <Select.Option value="Bon">{ t.veryGood }</Select.Option>
                        <Select.Option value="Excellent">{ t.excellent }</Select.Option>
                        <Select.Option value="Neuf">{ t.new }</Select.Option>
                    </Select>
                }/>
                <Spacer y={.8} />
                <Description title={ t.category } content={
                    <Select placeholder={ t.category } multiple width="100%" value={category} onChange={setCategory} style={{ maxWidth: "none" }}>
                        {
                            categoryList.map(s => <Select.Option value={s}>{s}</Select.Option>)
                        }
                    </Select>
                }/>
            </Grid>
            <Grid xs={24} md={18}>
                <Grid.Container gap={2} justify="flex-start">
                    {
                        all.length == 0 ? <Text h4 type="secondary" align="center" style={{width: "100%"}}>{ t.searchError }</Text> : all
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
import { getSize } from "../../locales/Fuse"

export async function getStaticProps({ locale }) {
	const query = AllProducts
    const result = await graphQLClient.request(query)
    // Locales
	const locales = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][locale]
	]))
    return {
        props: {
            products: result.allProducts.data,
            t: locales
        },
        revalidate: 300
    }
}