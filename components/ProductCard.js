import { Card, Image, Text, Row } from "@geist-ui/react"
import styles from "../styles/ProductCard.module.scss"
import Link from 'next/link'
export default function ProductCard({ product }) {
    return <Link href="/product/[product]" as={ `/product/${product._id}` }>
        <Card width="300" hoverable shadow style={{ cursor: "pointer", textAlign: "center" }}>
            <Image width={ 300 } height={ 200 } src={ `https://ik.imagekit.io/ittx2e0v7x/tr:w-300,h-200,fo-auto/${product.image}` } style={{ objectFit: 'cover' }} alt={ product.name }/>
            <Text h4 style={{ marginBottom: '0' }}>{ product.name }</Text>
            <Text small className={ styles.truncate }>{ `${product.description} - ${product.size}` }</Text>
            <Text h4 style={{ color: "#ea4335" }}>{ product.price }$</Text>
        </Card>
    </Link>
    
}