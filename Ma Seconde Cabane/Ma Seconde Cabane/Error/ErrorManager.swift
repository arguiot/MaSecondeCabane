//
//  ErrorManager.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 19/09/2022.
//

import Foundation
import StripeTerminal

@MainActor
class ErrorManager: ObservableObject {
    static let shared = ErrorManager()
    
    struct ErrorObject: Identifiable {
        var id: UUID
        var error: any Error
        var title: String
    }
    
    struct MessageObject: Identifiable {
        var id: UUID
        var message: String
        var title: String
    }
    
    enum RandomError: LocalizedError {
        case badError
    }
    
    @Published var errors: [ErrorObject] = []
    @Published var messages: [MessageObject] = []
    
    func push(title: String, error: Error) {
        print(title, error)
        errors.append(ErrorObject(id: .init(), error: error, title: title))
    }
    
    func push(title: String, message: String) {
        print(title, message)
        messages.append(MessageObject(id: .init(), message: message, title: title))
    }
}
