//
//  ProductCard.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 12/09/2022.
//

import SwiftUI

struct ProductCard: View {
    var productID: String
    
    @State var product: Product?
    @State var error = false
    var body: some View {
        HStack {
            Spacer()
            if let product = self.product {
                HStack {
                    AsyncImage(url: product.imageURL)
                    VStack(alignment: .leading) {
                        Text(product.name)
                            .bold()
                        Text(product.description)
                    }
                    .foregroundColor(.black)
                }
            } else if error {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.largeTitle)
                    .foregroundColor(.red)
            } else {
                ProgressView()
            }
            Spacer()
        }
        .padding()
        .background(Color.white)
        .cornerRadius(5)
        .preferredColorScheme(.light)
        .task {
            do {
                self.product = try await Product.from(id: productID)
            } catch {
                print(error)
                self.error = true
            }
        }
    }
}

struct ProductCard_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            ProductCard(productID: "330208693014495824")
        }
    }
}
