class CartManager {
    constructor() {
        this.setUp()
    }

    get isServer() {
        return typeof window === 'undefined'
    }

    setUp() {
        if (this.isServer) return

        const cartString = localStorage.getItem("cart")
        if (cartString == null) {
            localStorage.setItem("cart", "[]") // Empty array
        }
    }

    get cart() {
        if (this.isServer) return []
        
        let cartString = localStorage.getItem("cart")
        if (cartString == null) {
            cartString = "[]"
        }
        const cart = JSON.parse(cartString)
        return cart
    }
    get numberOfItems() {
        return this.cart.length
    }
}

export default new CartManager()