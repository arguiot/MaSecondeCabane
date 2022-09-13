//
//  Ma_Seconde_CabaneApp.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 12/09/2022.
//

import SwiftUI
import StripeTerminal

@main
struct Ma_Seconde_CabaneApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

class AppDelegate: UIResponder, UIApplicationDelegate {
    /**
     To get started with this demo, you'll need to first deploy an instance of
     our provided example backend:
     https://github.com/stripe/example-terminal-backend
     After deploying your backend, replace nil on the line below with the URL
     of your Heroku app.
     static var backendUrl: String? = "https://your-app.herokuapp.com"
     */
    static var backendUrl: String?
    
    static var apiClient: APIClient?
    
    var window: UIWindow?
    
    public let defaultCurrency = "CAD"
    
    // This can be used to set the location in the ConnectionConfiguration.
    var locationToRegisterTo: Location?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        guard let backendUrl = AppDelegate.backendUrl else {
            fatalError("You must provide a backend URL to run this app.")
        }
        
        let apiClient = APIClient()
        apiClient.baseURLString = backendUrl
        Terminal.setTokenProvider(apiClient)
        AppDelegate.apiClient = apiClient
        
        // To log events from the SDK to the console:
        // Terminal.shared.logLevel = .verbose
        return true
    }
    
}
