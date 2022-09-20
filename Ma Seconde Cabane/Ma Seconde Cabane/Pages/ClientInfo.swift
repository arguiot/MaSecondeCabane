//
//  ClientInfo.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 19/09/2022.
//

import SwiftUI

struct ClientInfo: View {
    @State var firstName = ""
    @State var lastName = ""
    
    @State var email = ""
    
    @Binding var showCheckout: Bool
    
    @State var pay = false
    
    @ObservedObject var cart = Cart.shared
    @EnvironmentObject var stripeController: StripeController
    
    var body: some View {
        VStack(spacing: 0) {
            Form {
                Section("Identité") {
                    TextField("Prénom", text: $firstName)
                    TextField("Nom", text: $lastName)
                }
                Section("Email") {
                    TextField("Email", text: $email)
                }
            }
            Spacer()
            NavigationLink(isActive: $pay) {
                PaymentView(showCheckout: $showCheckout)
                    .navigationBarBackButtonHidden(true)
            } label: {
                Button {
                    // Checkout
                    pay.toggle()
                    Task {
                        do {
                            try await stripeController.collectPayment(cart: self.cart, email: email, firstName: firstName, lastName: lastName)
                        } catch {
                            ErrorManager.shared.push(title: "Collect Payment", error: error)
                        }
                    }
                } label: {
                    Text("Payer - \(String(format: "%.2f", Double(cart.total) / 100))$")
                }.buttonStyle(BigButtonStyle())
            }
        }
        .navigationTitle("Informations Client")
    }
}

struct ClientInfo_Previews: PreviewProvider {
    static var previews: some View {
        ClientInfo(showCheckout: .constant(true))
    }
}
