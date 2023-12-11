import { Page, Select, Grid, Text, Description, Spacer, Input, Pagination, Row, Divider } from "@geist-ui/react"
import { ChevronLeft, ChevronRight, Search, X } from "@geist-ui/react-icons"
import Head from "next/head"
import NavBar from "../../components/NavBar"
import ProductCard from '../../components/ProductCard'
import SearchKit from "../../utils/Search"
import { withRouter } from 'next/router'
import Footer from "../../components/Footer"
import { getCategory, getSize } from "../../locales/Fuse"
import React, { useContext, useMemo } from "react";
import styles from "../../styles/All.module.scss"

function AllPage({ products, router, t }) {
    const [sexe, setGender] = React.useState(router.query.gender)
    // Get values from context
    const { state, setState } = useContext(FilterContext)
    const { size, category, etat, page, search } = state
    const setFilterState = obj => {
        setState({ ...state, ...obj, page: 0 })
    }
    const setSize = size => setFilterState({ size })
    const setCategory = category => setFilterState({ category })
    const setEtat = etat => setFilterState({ etat })
    const setSearch = search => setFilterState({ search })
    const setPage = n => {
        setState({ ...state, page: n - 1 })
        window.scrollTo(0, 0)
    }

    const sizeList = [
        "0 mois", "1 mois", "3 mois", "6 mois", "9 mois", "12 mois", "18 mois",
        "2 ans", "3 ans", "4 ans", "5 ans", "6 ans", "7 ans", "8 ans", "9 ans", "10 ans", "11 ans", "12 ans"
    ]
    const shoeSizes = [
        "16-20 EU",
        "21-24 EU",
        "25-29 EU",
        "30-34 EU",
        "34-36 EU"
    ]

    const categoryList = [
        "Accessoires",
        "Chaussures",
        "Chemises, T-shirts & Blouses",
        "Gilets, Pulls & Sweat Shirts",
        "Pantalons, Jupes & Shorts",
        "Plage",
        "Pyjamas & Bodies",
        "Robes & Combinaisons",
        "Vestes, Manteaux & Doudounes"
    ]

    // Search logic
    function results(search, sexe, size, etat) {
        const pr = [].concat(products).reverse()
        const prdcts = pr.filter(p => {
            // Quantite
            if (p.quantity < 1 || p.waitingForCollect == true) {
                return false
            }
            // Filtres
            if (p.sexe != "Mixte" && p.sexe != sexe && typeof sexe == "string") {
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

        const searchKit = new SearchKit(prdcts)

        if (typeof search == "string" && search != "") {
            debugger;
            return searchKit.search(search, router.locale).map(e => e.item)
        }

        return prdcts
    }

    function selectOption(label, value, hidden) {
        if (value.includes(label) || value.includes(hidden)) {
            return <Row justify="space-between" align="middle">
                <Text>{label}</Text>
                <X size={16} className={styles.icon} />
            </Row>
        }
        return label
    }

    const r = useMemo(() => results(search, sexe, size, etat), [search, sexe, size, etat, category])

    const all = useMemo(() => {
        if (r.length == 0) { return <Text h4 type="secondary" align="center" style={{ width: "100%" }}>{t.searchError}</Text> }
        return r.slice(page * 12, page * 12 + 12).map(p => {
            return <Grid xs={24} md={8} key={p._id}>
                <ProductCard product={p} />
            </Grid>
        })
    }, [page, r])

    const setSexe = sexe => {
        const s = sexe == "Fille" ? "Fille" : "Garçon"
        setGender(s)
        const url = new URL(router.asPath, `${window.location.protocol}//${window.location.host}`)
        url.searchParams.set('gender', s)
        if (window.location.search != url.search) {
            router.push(url.pathname + url.search, undefined, { shallow: true })
            setPage(1)
        }
    }

    React.useEffect(() => {
        const handleRoute = () => {
            const params = new URLSearchParams(window.location.search)
            setSexe(params.get("gender"))
        }
        const handleRouteChange = (url, { shallow }) => {
            if (!url.match("\/product\/all")) {
                router.events.off('routeChangeComplete', handleRoute)
                router.events.off('routeChangeStart', handleRouteChange)
            }
        }

        router.events.on('routeChangeStart', handleRouteChange)
        router.events.on('routeChangeComplete', handleRoute)

        handleRoute()

        return () => {
            router.events.off('routeChangeComplete', handleRoute)
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [])

    return <>
        <Head>
            <title>Ma Seconde Cabane - {t.products}</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content={t.metaDescription} />
        </Head>
        <NavBar />
        <Page>
            <Grid.Container gap={2} justify="center">
                <Grid xs={24} md={6}>
                    <Text h4>Filtres</Text>
                    <Description title={t.search} content={
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            icon={<Search />}
                            placeholder={t.brands}
                            clearable
                            width="100%" />
                    } />
                    <Spacer y={.8} />
                    <Description title={t.gender} content={
                        <Select placeholder={t.gender} value={sexe} onChange={setSexe} width="100%" style={{ maxWidth: "none" }}>
                            <Select.Option value="Fille">{t.girl}</Select.Option>
                            <Select.Option value="Garçon">{t.boy}</Select.Option>
                        </Select>
                    } />
                    <Spacer y={.8} />
                    <Description title={t.size} content={
                        <Select placeholder={t.size} multiple width="100%" value={size} onChange={setSize} className={styles.select}>
                            <Divider>{t.cloths}</Divider>
                            {
                                sizeList.map(s => <Select.Option value={s} className={styles.selectOption} key={s}>{selectOption(getSize(s, router.locale), size, s)}</Select.Option>)
                            }
                            <Divider>{t.shoes}</Divider>
                            {
                                shoeSizes.map(s => <Select.Option value={s} className={styles.selectOption} key={s}>{selectOption(s, size, s)}</Select.Option>)
                            }
                        </Select>
                    } />
                    <Spacer y={.8} />
                    <Description title={t.condition} content={
                        <Select placeholder={t.condition} multiple value={etat} onChange={setEtat} width="100%" className={styles.select}>
                            <Select.Option value="Bon" className={styles.selectOption}>{selectOption(t.veryGood, etat, "Bon")}</Select.Option>
                            <Select.Option value="Excellent" className={styles.selectOption}>{selectOption(t.excellent, etat, "Excellent")}</Select.Option>
                            <Select.Option value="Neuf" className={styles.selectOption}>{selectOption(t.new, etat, "Neuf")}</Select.Option>
                        </Select>
                    } />
                    <Spacer y={.8} />
                    <Description title={t.category} content={
                        <Select placeholder={t.category} multiple width="100%" value={category} onChange={setCategory} className={styles.select}>
                            {
                                categoryList.map(s => <Select.Option value={s} className={styles.selectOption}>{selectOption(getCategory(s, router.locale), category, s)}</Select.Option>)
                            }
                        </Select>
                    } />
                </Grid>
                <Grid xs={24} md={18}>
                    <Grid.Container gap={2} justify="flex-start">
                        {all}
                        <Spacer y={2} />
                        {
                            r.length > 0 && <Row justify="center" style={{ width: "100%" }}>
                                <Pagination count={Math.ceil(r.length / 12)} onChange={setPage} initialPage={page + 1}>
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
import { FilterContext } from "../../components/FilterContext"
import { allProducts } from "../../db/requests/products"

export async function getStaticProps({ locale }) {
    const result = await allProducts()
    // Locales
    const locales = Object.fromEntries(Object.entries(Locales).map(line => [
        line[0],
        line[1][locale.split("-")[0]]
    ]))
    return {
        props: {
            products: result.sort((a, b) => a.creation - b.creation),
            t: locales
        },
        revalidate: 600
    }
}