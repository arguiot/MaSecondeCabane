//
//  Scanner.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 18/09/2022.
//

import SwiftUI
import CodeScanner

struct Scanner: View {
    @State var productID = ""
    @State var showCard = false
    @State var showCheckout = false
    
    var body: some View {
        ZStack {
            CodeScannerView(codeTypes: [.code128], scanMode: .continuous) { response in
                if case let .success(result) = response {
                    productID = result.string
                    showCard = true
                }
            }
            .edgesIgnoringSafeArea(.vertical)
            VStack {
                Spacer()
                if showCard {
                    AsyncProductView(productID: productID, isShown: $showCard)
                        .transition(
                            .asymmetric(
                                insertion: .scale,
                                removal: .movingParts.skid(
                                    direction: .leading
                                )
                            )
                            .animation(
                                .interactiveSpring(dampingFraction: 0.66)
                                .speed(0.25)
                            )
                        )
                }
                CartView()
                    .frame(height: 100)
                // Long green button for checkout
                NavigationLink(isActive: $showCheckout) {
                    Checkout()
                } label: {
                    Button("Checkout", action: {
                        // Checkout
                        self.showCheckout.toggle()
                        NotificationCenter.default.addObserver(forName: .paymentSuccess, object: nil, queue: .main) { _ in
                            self.showCheckout = false
                        }
                    })
                    .buttonStyle(BigButtonStyle())
                    .cornerRadius(5)
                    .disabled(Cart.shared.products.isEmpty)
                    .opacity(Cart.shared.products.isEmpty ? 0.5 : 1)
                }
            }
            .padding()
        }
    }
}

extension Notification.Name {
    static let paymentSuccess = Notification.Name("paymentSuccess")
}

struct Scanner_Previews: PreviewProvider {
    static var previews: some View {
        Scanner()
    }
}
