import useSWR from "swr"
import { AllRequests } from "../lib/Requests"
import { graphQLClient } from "../utils/fauna";
import { Divider, Page, Tabs, Modal, Code, Button, Col, Image, Row, Text, Spacer, Fieldset, Grid, Description } from '@geist-ui/react'
import Head from 'next/head'

const fetcher = async (query) => await graphQLClient.request(query);

export default function Requests() {
    const { data, error } = useSWR(AllRequests, fetcher)
    if (error) {
        return <Modal open={true}>
            <Modal.Title>Error</Modal.Title>
            <Modal.Content>
                <p>Something went wrong</p>
                <Code block>{error}</Code>
            </Modal.Content>
        </Modal>
    }
    if (typeof data == "undefined") {
        return <>
        <Head>
            <title>Loading</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        </>
    }

    const requests = data.allRequest.data

    return <>
        <Text h3>Toutes les demandes</Text>
        <Grid.Container gap={2} justify="flex-start">
            {
            requests.map(request => {
                const { firstName, lastName, telephone, email } = request.customer
                const date = new Date(request._ts / 1000);
                const o_date = new Intl.DateTimeFormat;
                const f_date = (m_ca, m_it) => Object({...m_ca, [m_it.type]: m_it.value});
                const m_date = o_date.formatToParts(date).reduce(f_date, {});
                const formattedDate = m_date.day + '/' + m_date.month + '/' + m_date.year
            return <Grid xs={24} md={12}>
                <Fieldset>
                    <Fieldset.Content>
                        <Text h5>{ firstName + " " + lastName }</Text>
                        <Row>
                            <Description title="Telephone" content={telephone} />
                            <Spacer x={1}/>
                            <Description title="Email" content={email} />
                        </Row>
                    </Fieldset.Content>
                    <Fieldset.Footer>
                        <Fieldset.Footer.Status>
                            Date: { formattedDate }
                        </Fieldset.Footer.Status>
                        <Fieldset.Footer.Actions>
                           
                        </Fieldset.Footer.Actions>
                    </Fieldset.Footer>
                </Fieldset>
                <Spacer y={.8} />
            </Grid>
            })
            }
        </Grid.Container>
    </>
}