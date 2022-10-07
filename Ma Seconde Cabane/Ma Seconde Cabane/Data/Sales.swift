//
//  Sales.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 06/10/2022.
//

import Foundation

struct Sales: Codable {
    struct Sale: Codable {
        var date: Date
        var products: [Product]
    }
    
    var sales: [Sale]
    
    // MARK: - Persistence

    // Load the data from UserDefaults
    static func load() -> Sales? {
        let defaults = UserDefaults.standard
        guard let data = defaults.data(forKey: "sales") else { return nil }
        let decoder = JSONDecoder()
        return try? decoder.decode(Sales.self, from: data)
    }

    // Save the data to UserDefaults
    func save() {
        let defaults = UserDefaults.standard
        let encoder = JSONEncoder()
        if let data = try? encoder.encode(self) {
            defaults.set(data, forKey: "sales")
        }
    }

    // MARK: - Helpers
    static func addSale(products: [Product]) {
        var sales = Sales.load()?.sales ?? []
        sales.append(Sale(date: Date(), products: products))
        Sales(sales: sales).save()
    }
}
