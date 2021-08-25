import { Card, Image, Text, Row } from "@geist-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import styles from "../styles/ProductCard.module.scss"
export default function ProductCard({ product }) {
    const router = useRouter()
    function getDescription(product, lang) {
        if (lang == "en-CA" && product.descriptionEn != null) {
            return product.descriptionEn.split("\n")[0]
        }
        return product.description.split("\n")[0]
    }
    function getSize(product, lang) {
        const size = product.size
        const shoeSizes = [
            "16-20 EU",
            "21-24 EU",
            "25-29 EU",
            "30-34 EU",
            "34-36 EU"
        ]
        if (shoeSizes.includes(size)) {
            if (lang == "en-CA" && product.descriptionEn != null) {
                return product.descriptionEn.split("\n")[1]
            }
            return product.description.split("\n")[1]
        } else if (size == "1 mois" && lang == "en-CA") {
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
        <Card width="300" hoverable style={{ cursor: "pointer", textAlign: "center" }}>
            <Image width={ 300 } height={ 300 } src={ `https://images.masecondecabane.com/${product.image}?auto=compress&w=300&h=300&fit=crop` } style={{ objectFit: 'cover' }} alt={ product.name } loading="lazy"/>
            <Text h4 className={ styles.name }>{ product.name }</Text>
            <Text small className={ styles.truncate }>{ `${getDescription(product, router.locale)} - ${getSize(product, router.locale)}` }</Text>
            <Text h4 style={{ color: "#ea4335" }}>{ product.price }$</Text>
        </Card>
    </a>
    </Link>
}