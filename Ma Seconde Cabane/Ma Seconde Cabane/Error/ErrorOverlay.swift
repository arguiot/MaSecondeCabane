//
//  ErrorOverlay.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 19/09/2022.
//

import SwiftUI

struct ErrorOverlay: View {
    @State var showDetails = false
    @ObservedObject var manager = ErrorManager.shared
    
    var body: some View {
        VStack(alignment: .leading) {
            if manager.errors.count > 0 {
                ScrollView {
                    VStack {
                        if showDetails {
                            ForEach(manager.errors) { error in
                                VStack(alignment: .leading) {
                                    Text(error.title)
                                        .bold()
                                    Text(error.error.localizedDescription)
                                }
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.red)
                                .cornerRadius(5)
                                .transition(.push(from: .leading))
                                .rotationEffect(Angle(degrees: 180)).scaleEffect(x: -1.0, y: 1.0, anchor: .center)
                            }
                        }
                    }
                }
                .rotationEffect(Angle(degrees: 180)).scaleEffect(x: -1.0, y: 1.0, anchor: .center)
                Button {
                    showDetails.toggle()
                } label: {
                    HStack {
                        Image(systemName: "xmark.octagon")
                            .foregroundColor(.white)
                            .font(.title)
                        Text(showDetails ? "Fermer" : "\(manager.errors.count) Erreurs")
                            .foregroundColor(.white)
                    }
                    .padding(20)
                    .background(Color.red)
                    .clipShape(RoundedRectangle(cornerRadius: 50, style: .circular))
                    .shadow(radius: 10)
                    .animation(.default, value: showDetails)
                }
            }
            
        }
        .padding()
    }
}

struct ErrorOverlay_Previews: PreviewProvider {
    static var previews: some View {
        ErrorOverlay()
    }
}
