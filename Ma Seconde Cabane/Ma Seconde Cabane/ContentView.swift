//
//  ContentView.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 12/09/2022.
//

import SwiftUI
import CodeScanner

struct ContentView: View {
    @State var productID: String?
    var body: some View {
        ZStack {
            CodeScannerView(codeTypes: [.code128], scanMode: .oncePerCode) { response in
                if case let .success(result) = response {
                    productID = result.string
                }
            }
            .edgesIgnoringSafeArea(.vertical)
            if let id = productID {
                VStack {
                    Spacer()
                    ProductCard(productID: id)
                        .padding()
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
