//
//  APIClient.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 13/09/2022.
//

import Foundation
import StripeTerminal

public class APIClient: NSObject, ConnectionTokenProvider {
    
    // This comes from `AppDelegate.backendUrl`, set URL there
    public var baseURLString: String?
    
    private var baseURL: URL {
        if let urlString = self.baseURLString, let url = URL(string: urlString) {
            return url
        } else {
            fatalError("Base URL is invalid")
        }
    }
    
    // MARK: ConnectionTokenProvider
    fileprivate struct ConnectionToken: Decodable {
        var secret: StripeConnectionTokenObject
        struct StripeConnectionTokenObject: Decodable {
            var object: String
            var secret: String
        }
    }
    public func fetchConnectionToken() async throws -> String {
        let url = self.baseURL.appendingPathComponent("connection_token")
        let (data, _) = try await URLSession.shared.data(from: url)
        let token = try JSONDecoder().decode(ConnectionToken.self, from: data)
        return token.secret.secret
    }
}
