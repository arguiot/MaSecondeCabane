export const fuseOption = {
    includeScore: true,
    // Search in `author` and in `tags` array
    keys: [
        "name",
        "description",
        "descriptionEn",
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

export function buildIndex(products, lang) {
    return products.filter(e => e.quantity >= 1).map(p => {
        return {
            sizeFuse: getSize(p.size, lang),
            sexeFuse: getSex(p.sexe, lang),
            etatFuse: getCondition(p.etat, lang),
            ...p
        }
    })
}