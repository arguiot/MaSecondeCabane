//
//  ProductCard.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 12/09/2022.
//

import SwiftUI

struct AsyncProductView: View {
    var productID: String
    
    @Binding var isShown: Bool
    
    @State var product: Product?
    @State var error = false
    
    
    var body: some View {
        HStack {
            if let product = self.product {
                ProductView(product: product) {
                    Button {
                        // Add to basket
                        Cart.shared.products.append(product)
                        isShown = false
                    } label: {
                        // Icon with green circle background
                        Image(systemName: "cart.badge.plus")
                            .foregroundColor(.white)
                            .padding(10)
                            .background(Color.green)
                            .clipShape(Circle())
                    }
                }
            } else if error {
                Spacer()
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.largeTitle)
                    .foregroundColor(.red)
            } else {
                Spacer()
                ProgressView()
            }
            Spacer()
        }
        .padding()
        .background(Color.white)
        .cornerRadius(5)
        .preferredColorScheme(.light)
        .task(id: self.productID, {
            self.product = nil // Falls back to scanning state
            do {
                self.product = try await Product.from(id: productID)
            } catch {
                print(error)
                self.error = true
            }
        })
    }
}

struct ProductCard_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            AsyncProductView(productID: "330208693014495824", isShown: .constant(true))
        }
    }
}
