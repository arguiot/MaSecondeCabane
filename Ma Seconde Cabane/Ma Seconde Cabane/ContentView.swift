//
//  ContentView.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 19/09/2022.
//

import SwiftUI

struct ContentView: View {
    @StateObject var stripeController = StripeController()
    
    var body: some View {
        ZStack(alignment: .bottomLeading) {
            if stripeController.selectedReader == nil {
                NavigationView {
                    Locations()
                }
                .navigationViewStyle(.stack)
            } else {
                NavigationView {
                    ReaderInfo()
                }
                .navigationViewStyle(.stack)
            }
            ErrorOverlay()
        }
        .environmentObject(stripeController)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
