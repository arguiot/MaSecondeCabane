//
//  Catalog.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 27/09/2022.
//

import SwiftUI

struct Catalog: View {
    @EnvironmentObject var remoteCatalog: RemoteCatalog
    @State var query = ""
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            List(remoteCatalog.products, id: \._id) { product in
                ProductView(product: product) {
                    Button {
                        // Add to basket
                        Cart.shared.products.append(product)
                        dismiss()
                    } label: {
                        // Icon with green circle background
                        Image(systemName: "cart.badge.plus")
                            .foregroundColor(.white)
                            .padding(10)
                            .background(Color.green)
                            .clipShape(Circle())
                    }
                }
            }
            .searchable(text: $query, prompt: "Marque, Description, Code Barre...")
            .onChange(of: query) { newQuery in
                Task {
                    remoteCatalog.search(query: newQuery)
                }
            }
            .navigationTitle("Chercher un article")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        dismiss()
                    } label: {
                        Image("Dismiss")
                            .resizable()
                            .frame(width: 28, height: 28)
                    }
                    .buttonStyle(BorderlessButtonStyle())
                }
            }
        }
        .task {
            guard remoteCatalog.internalCatalog.isEmpty else { return }
            do {
                try await remoteCatalog.fetch()
            } catch {
                ErrorManager.shared.push(title: "Fetching Catalog", error: error)
            }
        }
    }
}

struct Catalog_Previews: PreviewProvider {
    static var previews: some View {
        Catalog()
    }
}
