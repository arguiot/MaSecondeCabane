export function getSize(size, lang) {

    if (size == "1 ans") {
        size = "12 mois"
    }
    
    if (size == "1 mois" && lang == "en-CA") {
        return "1 month"
    } else if (lang == "en-CA") {
        return size
        .replace("mois", "months")
        .replace("ans", "years")
    }
    return size
}
export function getSex(sexe, lang) {
    if (lang == "en-CA") {
        return sexe == "Fille" ? "Girl" : "Boy"
    }
    return sexe
}
export function getCondition(size, lang) {
    const conditions = {
        "Bon": {
            fr: "Très bon état",
            en: "Very good condition"
        },
        "Excellent": {
            fr: "Excellent état",
            en: "Excellent condition"
        },
        "Neuf": {
            fr: "Neuf avec étiquette",
            en: "Brand new and labeled"
        },
    }

    return conditions[size][lang]
}

export function getCategory(category, lang) {
    const categoryList = {
        "Accessoires": {
            fr: "Accessoires",
            en: "Accessories"
        },
        "Chaussures": {
            fr: "Chaussures",
            en: "Shoes"
        },
        "Chemises, T-shirts & Blouses": {
            fr: "Chemises, T-shirts & Blouses",
            en: "Shirts, T-shirts & Blouses"
        },
        "Gilets, Pulls & Sweat Shirts": {
            fr: "Gilets, Pulls & Sweat Shirts",
            en: "Vests & Sweatshirts"
        },
        "Pantalons, Jupes & Shorts": {
            fr: "Pantalons, Jupes & Shorts",
            en: "Trousers, Skirts & Shorts"
        },
        "Plage": {
            fr: "Plage",
            en: "Beach"
        },
        "Pyjamas & Bodies": {
            fr: "Pyjamas & Bodies",
            en: "Pajamas & Bodies"
        },
        "Robes & Combinaisons": {
            fr: "Robes & Combinaisons",
            en: "Dresses & Overalls"
        },
        "Vestes, Manteaux & Doudounes": {
            fr: "Vestes, Manteaux & Doudounes",
            en: "Jackets, Coats & Down jackets"
        }
    }
    return categoryList[category][lang.split("-")[0]]
}

export function getDescription(product, lang) {
    if (lang == "en-CA" && product.descriptionEn != null) {
        return product.descriptionEn
    }
    return product.description
}

export function getComposition(product, lang) {
    const compositionList = {
        "N/A": {
            fr: "N/A",
            en: "N/A"
        },
        "Coton": {
            fr: "Coton",
            en: "Cotton"
        },
        "Élasthanne": {
            fr: "Élasthanne/Lycra",
            en: "Spandex/Lycra"
        },
        "Lin": {
            fr: "Lin",
            en: "Linen"
        },
        "Synthétique": {
            fr: "Synthétique",
            en: "Synthetic"
        },
        "Laine": {
            fr: "Laine",
            en: "Wool"
        },
        "Cashmere": {
            fr: "Cashmere",
            en: "Cashmere"
        },
        "Cuir": {
            fr: "Cuir",
            en: "Leather"
        },
        "Polyamide": {
            fr: "Polyamide",
            en: " Polyamid"
        },
        "Polaire": {
            fr: "Polaire",
            en: "Fleece"
        },
        "Polyester": {
            fr: "Polyester",
            en: "Polyester"
        }
    }
    return product.composition.map(comp => compositionList[comp][lang.split("-")[0]]).join(", ")
}