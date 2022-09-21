//
//  Cart.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 18/09/2022.
//

import SwiftUI

class Cart: ObservableObject {
    static let shared = Cart()
    
    @Published var products: [Product] = []
    
    var subtotal: Int {
        return products.reduce(0) { $0 + $1.price }
    }
    var gst: Int {
        return subtotal * 5
    }
    var qst: Int {
        return Int(round(Double(subtotal) * 9.975))
    }
    var tax: Int {
        return gst + qst
    }
    var total: Int {
        return subtotal * 100 + tax
    }
}
