import { Divider, Image, Page, Row, Text } from "@geist-ui/react"
import Head from "next/head"
import NavBar from "../components/NavBar"
import styles from "../styles/Sell.module.scss"
import { Map, Marker, MapkitProvider, useMap } from 'react-mapkit'

function Popup({ router, t }) {
    // Get the query "locked" from the URL
    const locked = router.query.locked
    const token = "api/mapkit"
    const [address, setAddress] = React.useState(null)
    return <>
    <Head>
        <title>Ma Seconde Cabane - { t.popup }</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page>
        <Row justify="center">
            {/* <Users size={96} /> */}
            <Image src="/logo.svg" height={96} style={{ width: "unset", objectFit: "unset" }}/>
        </Row>
        <Text h1 align="center" className={ styles.title }>{ t.popup }</Text>
        { locked && <Text h3 align="center" className={ styles.title } type="error">{ t.locked }</Text> }
        <Divider />
        <Text h4>{ address }</Text>
        <MapkitProvider tokenOrCallback={token}>
            <div style={{ height: "50vh", width: "100%" }}>   
                <MapPopUp setAddress={setAddress} />
            </div>
        </MapkitProvider>
    </Page>
    <Footer />
    </>
}


function MapPopUp({ setAddress }) {
    const { map, mapkit, mapProps } = useMap({
        // showsCompass: mapkit.FeatureVisibility.Hidden,
        isZoomEnabled: true,
        showsZoomControl: true,
        showsMapTypeControl: true,
        isScrollEnabled: true,
        showsUserLocation: true
    })

    const config = useConfig()

    // Fetch config, get the location
    React.useEffect(async () => {
        if (typeof mapkit == "undefined") { return }
        if (typeof map == "undefined") { return }

        const location = config.popUpAddress
        const addr = `${location.street}, ${location.zipCode} ${location.city}, ${location.country}`

        const search = new mapkit.Search();

        search.search(addr, function(error, data) {
            if (error) {
                // Handle search error
                return;
            }
            const annotations = data.places.map(function(place) {
                const annotation = new mapkit.MarkerAnnotation(place.coordinate);
                annotation.title = "Ma Seconde Cabane";
                annotation.subtitle = place.formattedAddress;
                setAddress(place.formattedAddress)
                annotation.color = "#007577"
                annotation.glyphImage = { 1: "/favicon-white.svg" }
                annotation.selectedGlyphImage = { 1: "/favicon-white.svg" }
                annotation.selected = true
                return annotation;
            });
            map.showItems(annotations, {
                padding: new mapkit.Padding(120, 50, 120, 50),
                animate: true
            });
        });
    }, [mapkit, map])

    return <Map {...mapProps} />
}

import Locales from "../locales/popup"
import { withRouter } from "next/router"
import Footer from "../components/Footer"
import React from "react"
import getConfig from "../lib/config"
import { useConfig } from "./_app"
export async function getStaticProps({ locale }) {
    // Locales
	const locales = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][locale.split("-")[0]]
    ]))
    // Config
    const config = await getConfig()
    return {
        props: {
            t: locales,
            config
        }
    }
}
export default withRouter(Popup)