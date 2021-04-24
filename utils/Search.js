import Fuse from "fuse.js"
import { getSex, getSize, getCondition, getDescription, getComposition } from "../locales/Fuse"

export default class Search {
    constructor(data) {
        // Build Index
        this.buildIndex(data)

        // Filters
        this.filters = {
            sexe: { // Switch
                "Garçon": {
                    fr: ["garcon"], // Remove accent and treat as RegExp
                    en: ["boy"]
                },
                "Fille": {
                    fr: ["fille"],
                    en: ["girl"]
                }
            },
            etat: { // Conditional
                "Neuf": {
                    fr: ["neuf"],
                    en: ["new"]
                }
            },
            type: { // Selector
                "Accessoires": {
                    fr: ["accessoire"],
                    en: ["accessorie"]
                },
                "Chaussures": {
                    fr: ["chaussures"],
                    en: ["shoes"]
                },
                "Chemises, T-shirts & Blouses": {
                    fr: ["chemise", "shirt", "blouse"],
                    en: ["shirt", "blouse"]
                },
                "Gilets, Pulls & Sweat Shirts": {
                    fr: ["gilet", "pull", "sweat"],
                    en: ["vest", "sweat"]
                },
                "Pantalons, Jupes & Shorts": {
                    fr: ["pantalon", "jean", "jupe", "short"],
                    en: ["trouser", "jean", "skirt", "short"]
                },
                "Plage": {
                    fr: ["plage"],
                    en: ["beach"]
                },
                "Pyjamas & Bodies": {
                    fr: ["pyjama", "bodies"],
                    en: ["pajama", "bodies"]
                },
                "Robes & Combinaisons": {
                    fr: ["robe", "combi"],
                    en: ["dress", "overall"]
                },
                "Vestes, Manteaux & Doudounes": {
                    fr: ["veste", "manteau", "doudoune"],
                    en: ["jacket", "coats", "down"]
                }
            },
            size: (lang, query) => {
                const sizeList = [
                    "0 mois", "1 mois", "3 mois", "6 mois", "9 mois", "12 mois", "18 mois",
                    "2 ans", "3 ans", "4 ans", "5 ans", "6 ans", "7 ans", "8 ans", "9 ans", "10 ans", "11 ans", "12 ans"
                ]
                
                const localized = sizeList.map(size => {
                    if (size == "1 mois" && lang == "en-CA") {
                        return "1 month"
                    } else if (lang == "en-CA") {
                        return size
                        .replace("mois", "months")
                        .replace("ans", "years")
                    }
                    return size
                })
                for (let i = 0; i < localized.length; i++) {
                    const s = localized[i];
                    const r = query.replace(s, "")
                    if (r != query) { return { value: sizeList[i], query: r } }
                }
                return {
                    value: null,
                    query
                }
            }
        }
    }

    clean(query, lang) {
        const filter = {}
        const tokens = query.split(" ")

        function findFilter(lang, token, categories) {
            const categs = Object.keys(categories)
            for (let i = 0; i < categs.length; i++) {
                const filter = categories[categs[i]]
                const options = filter[lang.split("-")[0]]
                
                for (let index = 0; index < options.length; index++) {
                    const reg = options[index];
                    if (token.match(reg) != null) {
                        return categs[i]
                    }
                }
            }
            return null
        }
        const keys = Object.keys(this.filters)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const types = this.filters[key];

            if (typeof types == "function") {
                const out = types(lang, query)
                query = out.query
                if (out.value != null) {
                    filter[key] = out.value
                }
            } else if (key == "type") {
                filter[key] = tokens.map(token => {
                    const f = findFilter(lang, token, types)
                    if (f != null) {
                        query = query.replace(token, "")
                    }
                    return f
                }).filter(x => x)
            } else if (typeof types == "object") {
                const f = tokens.map(token => {
                    const f = findFilter(lang, token, types)
                    if (f != null) {
                        query = query.replace(token, "")
                    }
                    return f
                }).filter(x => x)
                if (f.length == 0) { continue }
                filter[key] = f[0]
            }
        }

        this.filter = filter
        return query
    }

    buildIndex(data) {
        this.fuseOption = {
            includeScore: true,
            // Search in `author` and in `tags` array
            keys: [
                {
                    name: "name",
                    weight: 0.5
                },
                {
                    name: "descriptionFuse",
                    weight: 2.5
                },
                {
                    name: "tags",
                    weight: 1.5
                }
            ]
        }
        function compileData(lang) {
            return data.filter(e => e.quantity >= 1).map(p => {
                return {
                    sizeFuse: getSize(p.size, lang),
                    sexeFuse: getSex(p.sexe, lang),
                    etatFuse: getCondition(p.etat, lang),
                    descriptionFuse: getDescription(p, lang),
                    compositionFuse: getComposition(p, lang),
                    ...p
                }
            })
        }
        this.dataFr = compileData("fr-CA")
        this.dataEn = compileData("en-CA")

        // this.indexFr = Fuse.createIndex(this.fuseOption.keys, this.dataFr)
        // this.indexEn = Fuse.createIndex(this.fuseOption.keys, this.dataEn)
    }

    filterData(data) {
        return data.filter(p => {
            // Filtres
            if (p.sexe != "Mixte" && p.sexe != this.filter.sexe && typeof this.filter.sexe == "string") {
                return false
            }
            if (p.size != this.filter.size && typeof this.filter.size == "string") {
                return false
            }
            if (Array.isArray(this.filter.type) && this.filter.type.length > 0 && !this.filter.type.includes(p.type)) {
                return false
            }
            if (p.etat != this.filter.etat && typeof this.filter.etat == "string") {
                return false
            }
            return true
        })
    }

    search(query, lang) {
        const q = this.clean(query, lang)
        if (lang == "fr-CA") {
            if (q == "") {
                return this.dataFr.map(e => ({ item: e }))
            }
            console.log({ filter: this.filter, data: this.filterData(this.dataFr) })
            const fuse = new Fuse(this.filterData(this.dataFr), this.fuseOption)
            return fuse.search(q)
        } else {
            if (q == "") {
                return this.dataEn.map(e => ({ item: e }))
            }
            const fuse = new Fuse(this.filterData(this.dataEn), this.fuseOption)
            return fuse.search(q)
        }
    }
}