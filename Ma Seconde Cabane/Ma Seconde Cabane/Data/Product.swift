//
//  Product.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 12/09/2022.
//

import Foundation

public struct Product: Codable {
    public var name: String
    public var image: String
    
    var imageURL: URL {
        return URL(string: "https://images.masecondecabane.com/\(self.image)?auto=compress&w=150&h=150&fit=crop")!
    }
    
    public var quantity: Int
    public var description: String
    public var descriptionEn: String?
    public var price: Int
    public var waitingForCollect: Bool?
    public var sexe: String
    public var size: String
    public var brand: String
    public var etat: String
    public var type: String
    public var tags: [String]
    public var favorite: Bool
    public var composition: [String]
    public var _id: String
    
    public static func from(id: String) async throws -> Product {
        guard id != "" else { throw URLError(.badURL) }
        let url = URL(string: "https://masecondecabane.com/api/pos/product/\(id)")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(APIClient.shared.accessToken)", forHTTPHeaderField: "Authorization")
        let (data, _) = try await URLSession.shared.data(for: request)
        let decoder = JSONDecoder()
        let product = try decoder.decode(Product.self, from: data)
        return product
    }
}

class RemoteCatalog: ObservableObject {
    var internalCatalog = [Product]()
    @Published var products = [Product]()
    
    func fetch() async throws {
        let url = URL(string: "https://masecondecabane.com/api/pos/product/all")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(APIClient.shared.accessToken)", forHTTPHeaderField: "Authorization")
        let (data, _) = try await URLSession.shared.data(for: request)
        let decoder = JSONDecoder()
        self.internalCatalog = try decoder.decode([Product].self, from: data)
        self.products = self.internalCatalog
    }

    func search(query: String) {
        // If the query is empty, we show all the products
        if query == "" {
            self.products = self.internalCatalog
            return
        }
        // Otherwise, we filter the products by name, description and id
        self.products = self.internalCatalog.filter { product in
            product.name.lowercased().contains(query.lowercased()) || product.description.lowercased().contains(query.lowercased()) || product._id.lowercased().contains(query.lowercased())
        }
    }
}
