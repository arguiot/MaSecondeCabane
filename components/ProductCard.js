import { Card, Image, Text, Row } from "@geist-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import styles from "../styles/ProductCard.module.scss"
export default function ProductCard({ product }) {
    const router = useRouter()
    function getDescription(product, lang) {
        if (lang == "en-CA" && product.descriptionEn != null) {
            return product.descriptionEn
        }
        return product.description
    }
    function getSize(size, lang) {
        if (size == "1 mois" && lang == "en-CA") {
            return "1 month"
        } else if (lang == "en-CA") {
            return size
            .replace("mois", "months")
            .replace("ans", "years")
        }
        return size
    }

    return <Link href={ `/${router.locale}/product/${product._id}` }>
    <a>
        <Card width="300" hoverable shadow style={{ cursor: "pointer", textAlign: "center" }}>
            <Image width={ 300 } height={ 300 } src={ `https://ik.imagekit.io/ittx2e0v7x/tr:w-300,h-300/${product.image}` } style={{ objectFit: 'cover' }} alt={ product.name } loading="lazy"/>
            <Text h4 style={{ marginBottom: '0' }}>{ product.name }</Text>
            <Text small className={ styles.truncate }>{ `${getDescription(product, router.locale)} - ${getSize(product.size, router.locale)}` }</Text>
            <Text h4 style={{ color: "#ea4335" }}>{ product.price }$</Text>
        </Card>
    </a>
    </Link>
}