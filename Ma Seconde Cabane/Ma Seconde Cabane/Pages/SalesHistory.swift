//
//  SalesHistory.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 06/10/2022.
//

import SwiftUI

struct SalesHistory: View {
    @State var sales = Sales.load()?.sales ?? []
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            List {
                ForEach(sales, id: \.date) { sale in
                    Section(header: Text(sale.date, style: .date)) {
                        ForEach(sale.products, id: \._id) { product in
                            ProductView(product: product) {}
                        }
                    }
                }
            }
            .refreshable {
                self.sales = Sales.load()?.sales ?? []
            }
            .navigationTitle("Historique des ventes")
            .toolbar { // Clear button + Dismiss
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        self.sales = []
                        Sales(sales: []).save()
                    }) {
                        Image(systemName: "trash")
                    }
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: {
                        self.dismiss()
                    }) {
                        Image("Dismiss")
                            .resizable()
                            .frame(width: 28, height: 28)
                    }
                    .buttonStyle(BorderlessButtonStyle())
                }
            }
        }
        
    }
}

struct SalesHistory_Previews: PreviewProvider {
    static var previews: some View {
        SalesHistory()
    }
}
