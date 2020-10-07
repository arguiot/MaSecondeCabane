import useSWR from "swr"
import { AllOverview } from "../lib/Requests"
import { graphQLClient } from "../utils/fauna";
import { Spinner, Modal, Code, Button, Row, Text, Spacer, Fieldset, Grid, Description, useModal, Divider, Link } from '@geist-ui/react'
import { useState } from "react";
import CardFromID from "./ProductCardFromID";

const fetcher = async (query) => await graphQLClient.request(query);

export default function Requests() {
    const { data, error } = useSWR(AllOverview, fetcher)
    const { setVisible: setReqVisible, bindings: ReqBindings } = useModal()
    const { setVisible: setOrdVisible, bindings: OrdBindings } = useModal()
    const [selected, setSelected] = useState()

    React.useEffect(() => {
        const jsScript = document.createElement('script')
        jsScript.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'

        document.body.appendChild(jsScript)

        jsScript.addEventListener('load', () => {
            mapkit.init({
                authorizationCallback: done => {
                    fetch("/api/mapkit")
                        .then(res => res.text())
                        .then(token => done(token))
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
        })
        
    }, [])

    if (error) {
        return <>
            <p>Something went wrong</p>
            <Code block>{JSON.stringify(error)}</Code>
        </>
    }
    if (typeof data == "undefined") {
        return <Row justify="center"><Spinner size="large"/></Row>
    }

    const requests = data.allRequest.data
    const orders = data.allOrders.data
    let map = {
        destroy: () => {}
    }
    const createMap = () => {
        const addr = `${selected.customer.address.street}, ${selected.customer.address.city}, ${selected.customer.address.zipCode}, ${selected.customer.address.country}`
        setTimeout(() => {
            map.destroy();
            const element = document.getElementById("map")
            if (typeof(element) != 'undefined' && element != null) {
                element.innerHTML = ""
            }
            
            map = new mapkit.Map(document.getElementById("map"), {
                showsCompass: mapkit.FeatureVisibility.Hidden,
                isZoomEnabled: true,
                showsZoomControl: true,
                showsMapTypeControl: true,
                isScrollEnabled: true,
                showsUserLocation: true
            });

            const search = new mapkit.Search();

            search.search(addr, function(error, data) {
                if (error) {
                    // Handle search error
                    return;
                }
                var annotations = data.places.map(function(place) {
                    var annotation = new mapkit.MarkerAnnotation(place.coordinate);
                    annotation.title = place.name;
                    annotation.subtitle = place.formattedAddress;
                    // annotation.color = "#9B6134";
                    return annotation;
                });
                map.showItems(annotations, {
                    padding: new mapkit.Padding(60, 25, 60, 25)
                });
            });
        }, 100)
        return addr
    }
    return <>
        <Text h3>Toutes les commandes</Text>
        <Grid.Container gap={2} justify="flex-start">
            {
            orders.map(order => {
                const { firstName, lastName, email } = order.customer
                const date = new Date(order._ts / 1000);
                const o_date = new Intl.DateTimeFormat;
                const f_date = (m_ca, m_it) => Object({...m_ca, [m_it.type]: m_it.value});
                const m_date = o_date.formatToParts(date).reduce(f_date, {});
                const formattedDate = m_date.day + '/' + m_date.month + '/' + m_date.year
            return <Grid xs={24} md={12}>
                <Fieldset>
                    <Fieldset.Content>
                        <Text h5>{ firstName + " " + lastName }</Text>
                        <Row>
                            <Description title="Total" content={`${order.total}$`} />
                            <Spacer x={1}/>
                            <Description title="Email" content={email} />
                        </Row>
                    </Fieldset.Content>
                    <Fieldset.Footer>
                        <Fieldset.Footer.Status>
                            Date: { formattedDate }
                        </Fieldset.Footer.Status>
                        <Fieldset.Footer.Actions>
                            <Button auto size="mini" onClick={() => { setOrdVisible(true); setSelected(order); }}>Afficher</Button>
                        </Fieldset.Footer.Actions>
                    </Fieldset.Footer>
                </Fieldset>
                <Spacer y={.8} />
            </Grid>
            })
            }
        </Grid.Container>
        <Divider />
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
                            <Button auto size="mini" onClick={() => { setReqVisible(true); setSelected(request); }}>Afficher</Button>
                        </Fieldset.Footer.Actions>
                    </Fieldset.Footer>
                </Fieldset>
                <Spacer y={.8} />
            </Grid>
            })
            }
        </Grid.Container>
        <Modal {...OrdBindings} width="45rem">
            { selected && <>
                <Modal.Title>{ `${selected.customer.firstName} ${selected.customer.lastName}` }</Modal.Title>
                <Modal.Content>
                    <Row justify="start">
                        <Description title="Total" content={`${selected.total}$`} />
                        <Spacer x={1}/>
                        <Description title="Stripe ID" content={
                            <Link color icon href="https://stripe.com">{selected.stripeID}</Link>
                        } />
                    </Row>
                    <Spacer y={1}/>
                    <Description title="Email" content={selected.customer.email} />
                    <Spacer y={1}/>
                    <Description title="Adresse" content={ createMap() } />
                    <Spacer y={.5}/>
                    <div id="map" style={{ height: "400px" }}></div>
                    <Spacer y={1}/>
                    <Divider>Contenu</Divider>
                    <Grid.Container gap={2} justify="flex-start">
                        {
                            selected.line.map(line => {
                            return <Grid xs={24} key={line.id}>
                                <Fieldset>
                                    <Fieldset.Content>
                                        <CardFromID id={ line.product } />
                                    </Fieldset.Content>
                                    <Fieldset.Footer>
                                        <Fieldset.Footer.Status>
                                            Quantité: { line.quantity }
                                        </Fieldset.Footer.Status>
                                    </Fieldset.Footer>
                                </Fieldset>
                            </Grid>})
                        }
                    </Grid.Container>
                </Modal.Content>
                </>
            }
        </Modal>
        <Modal {...ReqBindings} width="45rem">
            { selected && <>
                <Modal.Title>{ `${selected.customer.firstName} ${selected.customer.lastName}` }</Modal.Title>
                <Modal.Content>
                    <Description title="Telephone" content={selected.customer.telephone} />
                    <Spacer y={1}/>
                    <Description title="Email" content={selected.customer.email} />
                    <Spacer y={1}/>
                    <Description title="Adresse" content={ createMap() } />
                    <Spacer y={.5}/>
                    <div id="map" style={{ height: "400px" }}></div>
                    <Spacer y={1}/>
                    <Description title="Description" content={<Text small>{selected.description}</Text>} />
                </Modal.Content>
                </>
            }
        </Modal>
    </>
}