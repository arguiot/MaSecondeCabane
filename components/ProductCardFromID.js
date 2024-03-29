import { Image, Row, Col, Text, Spacer, Spinner } from "@geist-ui/react"
import { ProductByID } from "../lib/Requests";
import pStyles from '../styles/ProductCard.module.scss'
import { graphQLClient } from "../utils/fauna";
import React from "react";

export default function CardFromID({ id }) {
    const [data, setData] = React.useState()
    React.useEffect(() => {
        const query = ProductByID
        const variables = { id }
        graphQLClient.request(query, variables).then(data => setData(data))
    }, [id])
    if (typeof data == "undefined") {
        return <Spinner size="large" />
    }
    const product = data.findProductByID
    return <div className={ pStyles.container }>
        <Image src={ `https://images.masecondecabane.com/${product.image}?auto=compress&w=150&h=150&fit=crop` } height={100}
            className={ pStyles.img } />
        <Col className={ pStyles.desc }>
        <Text h5>{ product.name }</Text>
        <Text p className={ pStyles.truncate }>{ product.description }</Text>
        </Col>
        <Spacer x={2} />
        <Col span={3}>
        <Row align="middle" style={{ height: '100%' }}>
            <Text h5>{ product.price }$</Text>
        </Row>
        </Col>
    </div>
}