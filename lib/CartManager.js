import { Notification, NotificationCenter } from '@arguiot/broadcast.js'


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

    addItem(product) {
        const cart = this.cart
        cart.push(product)
        localStorage.setItem("cart", JSON.stringify(cart))
        // Broadcast
        const msg = new Notification("newItem", {
            cart
        })
        
        NotificationCenter.default.post(msg)
    }
}

export default new CartManager()