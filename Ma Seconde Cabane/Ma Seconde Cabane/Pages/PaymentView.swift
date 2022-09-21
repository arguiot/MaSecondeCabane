//
//  PaymentView.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 19/09/2022.
//

import SwiftUI

struct PaymentView: View {
    @EnvironmentObject var stripeController: StripeController
    @Binding var showCheckout: Bool
    
    var body: some View {
        switch stripeController.paymentState {
        case .none:
            VStack {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.largeTitle)
                    .foregroundColor(.red)
                Text("Oups! Quelque chose ne va pas!")
            }
        case .createIntent:
            VStack {
                LottieView(lottieFile: "checkout")
                Text("Création du paiement...")
            }
        case .collectPayment:
            VStack {
                LottieView(lottieFile: "applepay", to: 0.52)
                Button("Annuler") {
                    Task {
                        do {
                            try await self.stripeController.collectCancelable?.cancel()
                            showCheckout = false
                        } catch {
                            ErrorManager.shared.push(title: "Collect Payment", error: error)
                        }
                    }
                }
                .buttonStyle(BigButtonStyle(color: .red))
                Text("Attente du paiement...")
            }
        case .processPayment:
            VStack {
                LottieView(lottieFile: "applepay", from: 0.52, to: 1)
                Text("Traitement en cours...")
            }
        case .capturePayment:
            VStack {
                LottieView(lottieFile: "applepay", from: 0.52, to: 1)
                Text("Envoi du paiement...")
            }
        case .done(let id):
            VStack {
                LottieView(lottieFile: "success")
                    .frame(width: 200)
                Text("C'est bon!")
            }
            .task(id: id) {
                Cart.shared.products = [] // Empty cart
                // Delay to let the user see the success animation
                await Task.sleep(2 * 1_000_000_000) // 2 seconds
                showCheckout = false
            }
        }
    }
}

struct PaymentView_Previews: PreviewProvider {
    static var previews: some View {
        PaymentView(showCheckout: .constant(true))
    }
}
