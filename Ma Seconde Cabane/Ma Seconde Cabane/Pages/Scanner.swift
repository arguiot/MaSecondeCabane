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
    @State var showCatalog = false
    @ObservedObject var cart = Cart.shared
    var body: some View {
        ZStack {
            CodeScannerView(codeTypes: [.code128], scanMode: .continuous) { response in
                if case let .success(result) = response {
                    productID = result.string
                    showCard = true
                }
            }
            .edgesIgnoringSafeArea(.bottom)
            // Translucent Rectagle with red line crossing it, to show the user where to scan
            ZStack {
                Rectangle()
                    .foregroundColor(.white)
                    .opacity(0.2)
                    .frame(width: 300, height: 100)
                    .cornerRadius(10)
                Rectangle()
                    .foregroundColor(.red)
                    .frame(width: 350, height: 1)
                    .opacity(0.5)
            }
            .offset(y: -200)
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
                    .disabled(cart.products.isEmpty)
                    .opacity(cart.products.isEmpty ? 0.5 : 1)
                }
            }
            .padding()
        }
        .toolbar {
            Button {
                showCatalog.toggle()
            } label: {
                Label("Chercher", systemImage: "magnifyingglass")
            }
            .sheet(isPresented: $showCatalog) {
                Catalog()
            }
        }
        .navigationTitle("Scanner")
        .navigationBarTitleDisplayMode(.inline)
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
