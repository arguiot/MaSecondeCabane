import { Description, Grid, Page, Text, Input, Divider, Spacer, Textarea, Button, Row } from "@geist-ui/react"
import Head from "next/head"
import Footer from "../../components/Footer"
import NavBar from "../../components/NavBar"
export default function Sell() {
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
                    <Input name="fristname" placeholder="Prénom" width="100%" />
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Nom" content={
                    <Input name="lastname" placeholder="Nom de famille" width="100%" />
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Email" content={
                    <Input placeholder="example@mail.com" width="100%" />
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Telephone" content={
                    <Input placeholder="+1 ..." width="100%" type="tel" />
                } />
            </Grid>
        </Grid.Container>
        <Spacer y={2} />
        <Text h4>Adresse</Text>
        <Divider />
        <Grid.Container justify="center" gap={2}>
            <Grid xs={12}>
                <Description title="Rue" content={
                    <Input placeholder="Adresse ligne 1" width="100%" />
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Ville" content={
                    <Input placeholder="Ville" width="100%" />
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Code postal" content={
                    <Input placeholder="Code postal" width="100%" />
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Pays" content={
                    <Input initialValue="Canada" placeholder="Pays" width="100%" />
                } />
            </Grid>
        </Grid.Container>
        <Spacer y={2} />
        <Text h4>Description</Text>
        <Textarea width="100%" placeholder="Décrivez ce que vous voulez nous vendre. Veuillez noter que nous ne répondrons qu'aux demande répondant à nos critères." minHeight="500px" />
        <Spacer y={1} />
        <Row>
            <Button shadow type="secondary">Envoyer</Button>
        </Row>
        <Text small>Nous essayerons de vous répondre le plus tôt possible!</Text>
    </Page>
    <Footer />
    </>
}