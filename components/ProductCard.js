import { Card, Image, Text, Row } from "@geist-ui/react"
import { useRouter } from "next/router"
import styles from "../styles/ProductCard.module.scss"
export default function ProductCard({ product }) {
    const router = useRouter()
    const redirect = e => {
        e.preventDefault()
        router.push(e.currentTarget.href).then(() => {
            window.scrollTo(0, 0)
            document.body.focus()
        })
    }
    return <a href={ `/product/${product._id}` } onClick={redirect}>
        <Card width="300" hoverable shadow style={{ cursor: "pointer", textAlign: "center" }}>
            <Image width={ 300 } height={ 300 } src={ `https://ik.imagekit.io/ittx2e0v7x/tr:w-300,h-300/${product.image}` } style={{ objectFit: 'cover' }} alt={ product.name } loading="lazy"/>
            <Text h4 style={{ marginBottom: '0' }}>{ product.name }</Text>
            <Text small className={ styles.truncate }>{ `${product.description} - ${product.size}` }</Text>
            <Text h4 style={{ color: "#ea4335" }}>{ product.price }$</Text>
        </Card>
    </a>
    
}