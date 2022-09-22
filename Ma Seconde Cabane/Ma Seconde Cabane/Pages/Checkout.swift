//
//  Checkout.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 18/09/2022.
//

import SwiftUI

struct Checkout: View {
    @ObservedObject var cart = Cart.shared
    
    @State var continuePage = false
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        VStack {
            List {
                Section("Cart") {
                    ForEach(cart.products, id: \._id) { item in
                        ProductView(product: item) {}
                            .swipeActions(edge: .leading, allowsFullSwipe: true) {
                                Button(action: { removeSingle(item: item) }) {
                                    Label("Remove one", systemImage: "bag.badge.minus")
                                }
                                .tint(.yellow)
                            }
                            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                                Button(action: { deleteItem(item: item) }) {
                                    Label("Delete", systemImage: "cart.badge.minus")
                                }
                                .tint(.red)
                            }
                    }
                }
            }
            Spacer()
            HStack {
                Text("TPS")
                Spacer()
                Text("\(String(format: "%.2f", Double(cart.gst) / 100))$")
            }
            .padding(.horizontal)
            HStack {
                Text("TVQ")
                Spacer()
                Text("\(String(format: "%.2f", Double(cart.qst) / 100))$")
            }
            .padding()
            NavigationLink(isActive: $continuePage) {
                ClientInfo()
            } label: {
                Button {
                    // Checkout
                    self.continuePage = true
                } label: {
                    Text("Continuer - \(String(format: "%.2f", Double(cart.total) / 100))$")
                }.buttonStyle(BigButtonStyle())
            }
        }
        .navigationTitle("Current Sale (\(cart.products.count))")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func deleteItem(item: Product) {
        self.cart.products.removeAll(where: { $0._id == item._id })
    }
    
    private func removeSingle(item: Product) {
        guard let index = self.cart.products.firstIndex(where: { $0._id == item._id }) else { return }
        self.cart.products[index].quantity -= 1
        guard self.cart.products[index].quantity > 0 else { return deleteItem(item: item) }
        self.cart.objectWillChange.send()
    }
}

struct Checkout_Previews: PreviewProvider {
    static var previews: some View {
        Checkout()
    }
}
