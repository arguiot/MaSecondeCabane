export const fuseOption = {
    includeScore: true,
    // Search in `author` and in `tags` array
    keys: [
        "name",
        "descriptionFuse",
        "sexeFuse",
        "sizeFuse",
        "brand",
        "etatFuse",
        "tags",
        "type",
        "composition"
    ]
}

export function getSize(size, lang) {
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
            fr: "Neuf",
            en: "New"
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
            en: "Vests, Sweatshirts & Sweat Shirts"
        },
        "Pantalons, Jupes & Shorts": {
            fr: "Pantalons, Jupes & Shorts",
            en: "Trousers, Skirts & Shorts"
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
            en: "Jackets, Coats & Jackets & Down jackets"
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

export function buildIndex(products, lang) {
    return products.filter(e => e.quantity >= 1).map(p => {
        return {
            sizeFuse: getSize(p.size, lang),
            sexeFuse: getSex(p.sexe, lang),
            etatFuse: getCondition(p.etat, lang),
            descriptionFuse: getDescription(p, lang),
            ...p
        }
    })
}