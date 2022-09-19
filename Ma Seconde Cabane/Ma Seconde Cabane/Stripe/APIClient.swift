//
//  APIClient.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 13/09/2022.
//

import Foundation
import StripeTerminal

public class APIClient: NSObject, ConnectionTokenProvider {
    public static let shared = APIClient()
    
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
    
    func capturePaymentIntent(_ paymentIntentId: String) async throws {
        let config = URLSessionConfiguration.default
        let session = URLSession(configuration: config, delegate: nil, delegateQueue: OperationQueue.main)
        let url = self.baseURL.appendingPathComponent("capture_payment_intent")
        
        let parameters = "{\"payment_intent_id\": \"\(paymentIntentId)\"}"
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = parameters.data(using: .utf8)
        
        let (_, _) = try await session.data(for: request)
    }
}
