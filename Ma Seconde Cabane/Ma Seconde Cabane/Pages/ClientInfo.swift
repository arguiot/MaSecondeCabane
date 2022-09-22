//
//  ClientInfo.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 19/09/2022.
//

import SwiftUI
import Pow
struct ClientInfo: View {
    @State var firstName = ""
    @State var lastName = ""
    
    @State var email = ""
    
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
            if firstName != "" && lastName != "" && email.isEmail {
                NavigationLink(isActive: $pay) {
                    PaymentView()
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
                    }
                    .buttonStyle(BigButtonStyle())
                    .transition(.movingParts.iris(
                        blurRadius: 50
                    ))
                    .zIndex(1)
                }
            }
        }
        .navigationTitle("Informations Client")
    }
}

extension String {
    var isEmail: Bool {
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPred = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        return emailPred.evaluate(with: self)
    }
}

struct ClientInfo_Previews: PreviewProvider {
    static var previews: some View {
        ClientInfo()
    }
}
