class Product {
    constructor({
        id,
        name,
        image,
        description,
        price,
        quantity = 1
    }) {
        this.name = name
        this.image = image
        this.description = description
        this._price = price
        this.quantity = quantity
        this.id = id
    }

    get price() {
        return this._price * this.quantity
    }

    get json() {
        return {
            name: this.name,
            image: this.image,
            description: this.description,
            price: this._price,
            quantity: this.quantity,
            id: this.id
        }
    }
}

export default Product