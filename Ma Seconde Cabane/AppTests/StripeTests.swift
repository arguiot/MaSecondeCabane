//
//  StripeTests.swift
//  AppTests
//
//  Created by Arthur Guiot on 15/09/2022.
//

import XCTest
import Ma_Seconde_Cabane

final class StripeTests: XCTestCase {
    func testConnectionToken() async throws {
        let apiClient = APIClient.shared
        apiClient.baseURLString = "https://masecondecabane.com/api/pos/"
        
        let token = try await apiClient.fetchConnectionToken()
        XCTAssertEqual(token.count, 91)
    }
}
