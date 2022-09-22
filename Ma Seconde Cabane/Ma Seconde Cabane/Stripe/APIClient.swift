//
//  APIClient.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 13/09/2022.
//

import Foundation
import StripeTerminal
import CryptoKit

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

    // MARK: Token
    var accessToken: String {
        let token = Bundle.main.infoDictionary?["POS_TOKEN"] as? String
        // SHA256 hash of the token
        let hash = SHA256.hash(data: token!.data(using: .utf8)!)
        let hashString = hash.compactMap { String(format: "%02x", $0) }.joined()
        return hashString
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
        var request = URLRequest(url: url)
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        let (data, _) = try await URLSession.shared.data(for: request)
        let token = try JSONDecoder().decode(ConnectionToken.self, from: data)
        return token.secret.secret
    }
    
    enum CapturePaymentError: LocalizedError {
        case noResponse
        var errorDescription: String? {
            switch self {
            case .noResponse:
                return "Le serveur n'a pas capturé le paiement. Vous ne serez pas facturé."
            }
        }
    }
    
    struct PaymentIntentPayload: Encodable {
        var payment_intent_id: String
        
        struct CartItem: Encodable {
            var product: String
            var quantity: Int
        }
        var items: [CartItem]
    }
    
    func capturePaymentIntent(_ paymentIntentId: String) async throws {
        let config = URLSessionConfiguration.default
        let session = URLSession(configuration: config, delegate: nil, delegateQueue: OperationQueue.main)
        let url = self.baseURL.appendingPathComponent("capture_payment_intent")
        
        let payload = PaymentIntentPayload(payment_intent_id: paymentIntentId, items: Cart.shared.products.map { PaymentIntentPayload.CartItem(product: $0._id, quantity: 1) })
        let encoder = JSONEncoder()
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        // Set Headers
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        // Set HTTP Request Body
        request.httpBody = try encoder.encode(payload)
        
        let (data, _) = try await session.data(for: request)
        
        // Print out response string
        let responseString = String(data: data, encoding: .utf8)
        
        guard responseString != "" else { throw CapturePaymentError.noResponse }
    }
}


// MARK: - Locations
extension APIClient {
    
    struct Location: Codable {
        var display_name: String
        var address: Address
        struct Address: Codable {
            var city: String?
            var country: String
            var line1: String
            var line2: String?
            var postal_code: String?
            var state: String?
        }
    }
    
    struct LocationObject: Decodable {
        var id: String
        var display_name: String
        var address: Location.Address
    }
    
    func listLocations() async throws -> [LocationObject] {
        let url = self.baseURL.appendingPathComponent("list_locations")
        var request = URLRequest(url: url)
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        let (data, _) = try await URLSession.shared.data(for: request)
        
        struct Locations: Decodable {
            var data: [LocationObject]
        }
        
        let locations = try JSONDecoder().decode(Locations.self, from: data)
        
        return locations.data
    }
    
    func createLocation(location: Location) async throws {
        let url = self.baseURL.appendingPathComponent("create_location")
        var request = URLRequest(url: url)
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(location)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        let _ = try JSONDecoder().decode(LocationObject.self, from: data)
    }

    func deleteLocation(locationId: String) async throws {
        let url = self.baseURL.appendingPathComponent("delete_location")
        var request = URLRequest(url: url)
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["id": locationId])
        
        let (_, _) = try await URLSession.shared.data(for: request)
    }
}
