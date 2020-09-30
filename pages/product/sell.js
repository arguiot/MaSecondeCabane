import { Description, Grid, Page, Text, Input, Divider, Spacer, Textarea, Button, Row } from "@geist-ui/react"
import Head from "next/head"
import { useState } from "react"
import Footer from "../../components/Footer"
import NavBar from "../../components/NavBar"
import { CreateRequest } from "../../lib/Requests"
import { graphQLClient } from "../../utils/fauna"
export default function Sell() {
    const [loading, setLoading] = useState(false)

    const [fname, setFName] = useState()
    const [lname, setLName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [street, setStreet] = useState()
    const [city, setCity] = useState()
    const [postal, setPostal] = useState()
    const [country, setCountry] = useState("Canada")
    const [description, setDescription] = useState()

    const submit = () => {
        const query = CreateRequest
        const variables = {
            data: {
                customer: {
                    firstName: fname,
                    lastName: lname,
                    address: {
                        street,
                        city,
                        zipCode: postal,
                        country
                    },
                    telephone: phone,
                    email
                },
                description
            }
        }
        setLoading(true)

        graphQLClient.request(query, variables).then(data => {
            alert(`Merci ${data.customer.firstName}`)
        })
    }

    return <>
	<Head>
		<title>Vendre</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page>
        <Text h1>Vendre vos vêtements</Text>
        <Text h4>Informations de base</Text>
        <Divider />
        <Grid.Container justify="center" gap={2}>
            <Grid xs={12}>
                <Description title="Prénom" content={
                    <Input name="fristname" placeholder="Prénom" width="100%" value={ fname } onChange={e => setFName(e.target.value)} disabled={ loading } />
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Nom" content={
                    <Input name="lastname" placeholder="Nom de famille" width="100%" value={ lname } onChange={e => setLName(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Email" content={
                    <Input placeholder="example@mail.com" width="100%" value={ email } onChange={e => setEmail(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Telephone" content={
                    <Input placeholder="+1 ..." width="100%" type="tel" value={ phone } onChange={e => setPhone(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
        </Grid.Container>
        <Spacer y={2} />
        <Text h4>Adresse</Text>
        <Divider />
        <Grid.Container justify="center" gap={2}>
            <Grid xs={12}>
                <Description title="Rue" content={
                    <Input placeholder="Adresse ligne 1" width="100%" value={ street } onChange={e => setStreet(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Ville" content={
                    <Input placeholder="Ville" width="100%" value={ city } onChange={e => setCity(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Code postal" content={
                    <Input placeholder="Code postal" width="100%" value={ postal } onChange={e => setPostal(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Pays" content={
                    <Input placeholder="Pays" width="100%" value={ country } onChange={e => setCountry(e.target.value)} disabled={ loading } />
                } />
            </Grid>
        </Grid.Container>
        <Spacer y={2} />
        <Text h4>Description</Text>
        <Textarea width="100%" placeholder="Décrivez ce que vous voulez nous vendre. Veuillez noter que nous ne répondrons qu'aux demande répondant à nos critères." minHeight="500px" value={ description } onChange={e => setDescription(e.target.value)} disabled={ loading }/>
        <Spacer y={1} />
        <Row>
            <Button shadow type="secondary" loading={ loading } onClick={ submit }>Envoyer</Button>
        </Row>
        <Text small>Nous essayerons de vous répondre le plus tôt possible!</Text>
    </Page>
    <Footer />
    </>
}