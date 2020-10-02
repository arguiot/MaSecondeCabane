import { Card, Image, Text, Row } from "@geist-ui/react"
import styles from "../styles/ProductCard.module.scss"
import Link from 'next/link'
export default function ProductCard({ product }) {
    return <Link href="/product/[product]" as={ `/product/${product._id}` }>
        <Card width="300" hoverable shadow style={{ cursor: "pointer" }}>
            <Image width={ 300 } height={ 200 } src={ `https://ik.imagekit.io/ittx2e0v7x/tr:w-300,h-200,fo-auto/${product.image}` } style={{ objectFit: 'cover' }} alt={ product.name }/>
            <Text h4 style={{ marginBottom: '0' }}>{ product.name }</Text>
            <Text type="secondary" small className={ styles.truncate }>{ product.description }</Text>
            <Card.Footer>
                <Row justify="space-between" style={{ width: "100%", alignItems: "center" }}>
                    <Text h5>Prix</Text>
                    <Text h4 type="warning">{ product.price }$</Text>
                </Row>
            </Card.Footer>
        </Card>
    </Link>
    
}