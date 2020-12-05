import { Description, Grid, Page, Text, Input, Divider, Spacer, Textarea, Button, Row, Note } from "@geist-ui/react"
import Head from "next/head"
import { useState } from "react"
import Footer from "../../components/Footer"
import NavBar from "../../components/NavBar"
import { CreateRequest } from "../../lib/Requests"
import { graphQLClient } from "../../utils/fauna"
import styles from "../../styles/Sell.module.scss"

export default function Sell({ t }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const [fname, setFName] = useState()
    const [lname, setLName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [street, setStreet] = useState()
    const [city, setCity] = useState()
    const [postal, setPostal] = useState()
    const [country, setCountry] = useState("Canada")
    const [description, setDescription] = useState()

    const getType = (prop) => {
        if (error == false) {
            return "default"
        }
        if (typeof prop == "undefined" || prop == "") {
            return "error"
        }
        return "default"
    }
    const submit = () => {
        setLoading(true)
        const array = [fname, lname, email, street, city, postal, country, description]
        for (let i = 0; i < array.length; i++) {
            const prop = array[i];
            if (typeof prop == "undefined" || prop == "") {
                setError(true)
                setLoading(false)
                return
            }
        }

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
                description,
                done: false
            }
        }

        graphQLClient.request(query, variables).then(data => {
            alert(`${t.thanks} ${data.createRequest.customer.firstName}!\n${t.respond}` )
            window.location = "/"
        })
    }

    return <>
	<Head>
        <title>Ma Seconde Cabane - { t.sell }</title>
		<link rel="icon" href="/favicon.ico" />
	</Head>
	<NavBar />
    <Page>
        <Text h2>{ t.sellClothes }</Text>
        <Text>
            { t.select }
        </Text>
        <Grid.Container justify="center" gap={2}>
            <Grid xs={ 24 } md={ 24 }>
                <Text h3>{ t.weBuy }</Text>
                <ul className={ styles.list }>
                    <li>{ t.zeroTen }</li>
                    <li>{ t.condition }</li>
                    <li>{ t.brands }</li>
                </ul>
            </Grid>
            <Grid xs={ 24 } md={ 24 }>
                <Text h3>{ t.weDontBuy }</Text>
                <ul className={ styles.list }>
                    <li>{ t.socks }</li>
                    <li>{ t.noBrand }</li>
                    <li>{ t.damaged }</li>
                </ul>
            </Grid>
        </Grid.Container>
        <Text>
            { t.howEvaluate }
        </Text>
        <ul className={ styles.list }>
            <li>{ t.jacadi }</li>
            <li>{ t.bonpoint }</li>
            <li>{ t.petitBateau }</li>
            <li>{ t.zara }</li>
        </ul>
        <Text>
            <Text b>NOTE:</Text> { t.donating }
        </Text>
        <Text>
            { t.organize }
        </Text>
        <Text h4>{ t.basicInfo }</Text>
        <Divider />
        <Grid.Container justify="center" gap={2}>
            <Grid xs={12}>
                <Description title={ t.firstName } content={
                    <Input name="fristname" placeholder={ t.firstName } width="100%" value={ fname } status={ getType(fname) } onChange={e => setFName(e.target.value)} disabled={ loading } />
                } />
            </Grid>
            <Grid xs={12}>
                <Description title={ t.lastName } content={
                    <Input name="lastname" placeholder={ t.lastName } width="100%" value={ lname } status={ getType(lname) } onChange={e => setLName(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title="Email" content={
                    <Input placeholder="example@mail.com" width="100%" value={ email } status={ getType(email) } onChange={e => setEmail(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title={ t.phone } content={
                    <Input placeholder={ `+1 ... (${t.notMandatory})`} width="100%" type="tel" value={ phone } onChange={e => setPhone(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
        {/* </Grid.Container>
        <Spacer y={2} />
        <Text h4>{ t.address }</Text>
        <Divider />
        <Grid.Container justify="center" gap={2}> */}
            <Grid xs={12}>
                <Description title={ t.street } content={
                    <Input placeholder={ t.line1 } width="100%" value={ street } status={ getType(street) } onChange={e => setStreet(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title={ t.city } content={
                    <Input placeholder={ t.city } width="100%" value={ city } status={ getType(city) } onChange={e => setCity(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title={ t.postal } content={
                    <Input placeholder={ t.postal } width="100%" value={ postal } status={ getType(postal) } onChange={e => setPostal(e.target.value)} disabled={ loading }/>
                } />
            </Grid>
            <Grid xs={12}>
                <Description title={ t.country } content={
                    <Input placeholder={ t.country } width="100%" value={ country } status={ getType(country) } onChange={e => setCountry(e.target.value)} disabled={ loading } />
                } />
            </Grid>
        </Grid.Container>
        <Spacer y={2} />
        <Text h4>{t.description}</Text>
        <Textarea width="100%" placeholder={ t.describe } minHeight="500px" status={ getType(description) } value={ description } onChange={e => setDescription(e.target.value)} disabled={ loading }/>
        <Spacer y={1} />
        <Row>
            <Button shadow type="secondary" loading={ loading } onClick={ submit }>{ t.submit }</Button>
        </Row>
    </Page>
    <Footer />
    </>
}

import Locales from "../../locales/sell"
export async function getStaticProps({ locale }) {
    // Locales
	const locales = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][locale.split("-")[0]]
    ]))
    return {
        props: {
            t: locales
        }
    }
}