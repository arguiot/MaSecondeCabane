//
//  ProductView.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 18/09/2022.
//

import SwiftUI

struct ProductView<Content: View>: View {
    @State var product: Product
    
    let content: Content
    
    init(product: Product, @ViewBuilder content: () -> Content) {
        self._product = .init(initialValue: product)
        self.content = content()
    }
    
    var body: some View {
        HStack {
            AsyncImage(url: product.imageURL)
                .frame(width: 150, height: 150)
            VStack(alignment: .leading) {
                Text(product.name)
                    .bold()
                Text(product.description)
                Text(String(product.price)).bold() + Text("$")
            }
            .foregroundColor(.black)
            
            content
        }
    }
}

