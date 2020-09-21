import { Notification, NotificationCenter } from '@arguiot/broadcast.js'
import Product from './Product'

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
        const products = cart.map(entry => {
            new Product(entry)
        })
        return cart
    }
    get numberOfItems() {
        return this.cart.reduce((a, b) => a + b.quantity, 0)
    }

    get subtotal() {
        const cart = this.cart
        return cart.reduce((accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity, 0)
    }

    addItem(product) {
        const cart = this.cart
        const index = cart.map(e => e.id).indexOf(product.id)

        product["quantity"] = 1 // Always 1 product at a time

        if (index >= 0) {
            cart[index].quantity += 1
        } else {
            cart.push(product)
        }
        localStorage.setItem("cart", JSON.stringify(cart))
        // Broadcast
        const msg = new Notification("newItem", {
            cart
        })
        
        NotificationCenter.default.post(msg)
    }

    removeProduct(id) {
        const cart = this.cart
        const index = cart.map(e => e.id).indexOf(id)
        if (index >= 0) {
            cart.splice(index, 1)
        }
        localStorage.setItem("cart", JSON.stringify(cart))
        // Broadcast
        const msg = new Notification("newItem", {
            cart
        })
        
        NotificationCenter.default.post(msg)
    }
}

export default new CartManager()