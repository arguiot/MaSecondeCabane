import { signin, signout, useSession } from 'next-auth/client'
import { Page, Tabs, Button, Row, Text, Spacer } from '@geist-ui/react'
import Head from 'next/head'
import NavBar from '../../components/NavBar'
import ProductForm from '../../components/ProductForm';
import Footer from '../../components/Footer';
import Overview from '../../components/Overview';
import ProductsDash from '../../components/ProductsDash';


export default function Dashboard() {
    const [ session, loading ] = useSession()

    const sign = <>
    <Spacer y={5} />
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    }}>
        <Text h1>Administration</Text>
        <Button auto type="success" onClick={ () => signin("google") }>Sign In With Google</Button>
        <Spacer y={12} />
    </div>
    </>

    const dash = <>
        <Page>
            <Row justify="space-between" width="100%" style={{ flexWrap: "wrap-reverse" }}>
                <Text h1>Dashboard</Text>
                <Button auto type="secondary" onClick={ signout }>Sign Out</Button>
            </Row>
            <Tabs initialValue="1">
                <Tabs.Item label="overview" value="1">
                    <Overview />
                </Tabs.Item>
                <Tabs.Item label="produits" value="2">
                    <ProductsDash />
                </Tabs.Item>
            </Tabs>
        </Page>
        <ProductForm />
    </>
    return <>
    <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <NavBar />
    {session && dash}
    {!session && sign}
    <Footer />
    </>
}