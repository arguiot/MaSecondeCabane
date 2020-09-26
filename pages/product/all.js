import { Page, Select, Grid, Text, Description, Spacer, Input } from "@geist-ui/react"
import { Search } from "@geist-ui/react-icons"
import Head from "next/head"
import NavBar from "../../components/NavBar"
import { graphQLClient } from '../../utils/fauna'
import { AllProducts } from '../../lib/Requests'
import ProductCard from '../../components/ProductCard'
import Fuse from 'fuse.js'
import { withRouter } from 'next/router'

function AllPage({ products, router }) {
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
    
    return <>
	<Head>
		<title>Produits</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page>
        <Grid.Container gap={2} justify="center">
            <Grid xs={24} md={6}>
                <Text h4>Filtres</Text>
                <Description title="Rechercher" content={
                    <Input 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    icon={<Search />} 
                    placeholder="Marques, couleurs, ..." 
                    clearable 
                    width="100%" />
                }/>
                <Spacer y={.8}/>
                <Description title="Genre" content={
                    <Select placeholder="Sexe" value={sexe} onChange={setSexe} width="100%" style={{ maxWidth: "none" }}>
                        <Select.Option value="Fille">Fille</Select.Option>
                        <Select.Option value="Garçon">Garçon</Select.Option>
                    </Select>
                }/>
                <Spacer y={.8} />
                <Description title="Taille" content={
                    <Select placeholder="Size" multiple width="100%" value={size} onChange={setSize} style={{ maxWidth: "none" }}>
                        {
                            sizeList.map(s => <Select.Option value={s}>{s}</Select.Option>)
                        }
                    </Select>
                }/>
                <Spacer y={.8} />
                <Description title="État" content={
                    <Select placeholder="État" multiple value={etat} onChange={setEtat} width="100%" style={{ maxWidth: "none" }}>
                        <Select.Option value="Bon">Très bon état</Select.Option>
                        <Select.Option value="Excellent">Excellent état</Select.Option>
                        <Select.Option value="Neuf">Neuf</Select.Option>
                    </Select>
                }/>
            </Grid>
            <Grid xs={24} md={18}>
                <Grid.Container gap={2} justify="flex-start">
                    {
                        results(search, sexe, size, etat).slice(0, 6).map(p => {
                            return <Grid xs={24} md={8}>
                                <ProductCard product={ p } />
                            </Grid>
                        })
                    }
                </Grid.Container>
            </Grid>
        </Grid.Container>
    </Page>
    </>
}

export default withRouter(AllPage)

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