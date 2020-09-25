import { Page, Text } from "@geist-ui/react"
import Head from "next/head"
import NavBar from "../components/NavBar"
export default function About() {
    return <>
	<Head>
		<title>À propos</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page>
        <Text h1>À propos de nous</Text>
    </Page>
    </>
}