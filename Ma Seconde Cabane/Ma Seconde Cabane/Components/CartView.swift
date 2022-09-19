//
//  Cart.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 18/09/2022.
//

import SwiftUI
import Pow
import Introspect
struct CartView: View {
    @ObservedObject var cart = Cart.shared
    var body: some View {
        // Horizontal scroll view with all the products pictures and their quantity and a button to go to the checkout
        ScrollView(.horizontal, showsIndicators: false) {
            LazyHStack {
                ForEach(cart.products, id: \._id) { product in
                    SmallProductView(product: product, removeOffset: .zero)
                }
                if cart.products.count < 3 {
                    // Populate with empty views
                    ForEach(0..<3-cart.products.count, id: \.self) { _ in
                        Rectangle()
                            .frame(width: 100, height: 100)
                            .foregroundColor(.gray)
                            .cornerRadius(5)
                            .opacity(0.5)
                    }
                }
            }
        }.introspectScrollView { scrollView in
            scrollView.clipsToBounds = false
        }
    }
}

struct Cart_Previews: PreviewProvider {
    static var previews: some View {
        CartView()
    }
}

struct SmallProductView: View {
    @State var product: Product
    @State var removeOffset: CGSize = .zero
    
    var body: some View {
        ZStack {
            Color.white
            AsyncImage(url: product.imageURL, scale: 2)
        }
        .cornerRadius(5)
        .frame(width: 100, height: 100)
        .offset(removeOffset)
        .gesture(DragGesture()
            .onChanged{ value in
                self.removeOffset.height = min(max(value.translation.height, -100), 0)
            }
            .onEnded { value in
                if abs(value.translation.height) > 20 {
                    Cart.shared.products.removeAll(where: { $0._id == product._id })
                    self.removeOffset = .zero // Resets drag
                }
            })
        .transition(
            .asymmetric(
                insertion: .scale,
                removal: .movingParts.poof
            )
            .animation(
                .interactiveSpring(dampingFraction: 0.66)
                .speed(0.25)
            )
        )
    }
}
