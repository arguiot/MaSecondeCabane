//
//  DataTests.swift
//  AppTests
//
//  Created by Arthur Guiot on 12/09/2022.
//

import XCTest
import Ma_Seconde_Cabane
final class DataTests: XCTestCase {
    func testProduct() async throws {
        let product = try await Product.from(id: "279853827749839366")
        
        XCTAssertEqual(product.name, "BONPOINT")
    }
}
