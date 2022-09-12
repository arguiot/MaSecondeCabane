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
        let url = URL(string: "https://masecondecabane.com/api/pos/product/\(id)")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let decoder = JSONDecoder()
        let product = try decoder.decode(Product.self, from: data)
        return product
    }
}
