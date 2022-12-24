//
//  ErrorOverlay.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 19/09/2022.
//

import SwiftUI

struct ErrorOverlay: View {
    @State var showErrorDetails = false
    @State var showMessageDetails = false
    @ObservedObject var manager = ErrorManager.shared
    
    var body: some View {
        ZStack(alignment: .bottom) {
            HStack {
                Spacer()
                VStack(alignment: .trailing) {
                    if manager.messages.count > 0 {
                        ScrollView {
                            VStack {
                                if showMessageDetails {
                                    ForEach(manager.messages) { message in
                                        VStack(alignment: .leading) {
                                            Text(message.title)
                                                .bold()
                                            Text(message.message)
                                        }
                                        .foregroundColor(.white)
                                        .padding()
                                        .background(Color.blue)
                                        .cornerRadius(5)
                                        .transition(.push(from: .leading))
                                        .rotationEffect(Angle(degrees: 180)).scaleEffect(x: -1.0, y: 1.0, anchor: .center)
                                    }
                                }
                            }
                        }
                        .rotationEffect(Angle(degrees: 180)).scaleEffect(x: -1.0, y: 1.0, anchor: .center)
                        Button {
                            if showMessageDetails {
                                manager.messages = [] // Clear
                            }
                            showMessageDetails.toggle()
                        } label: {
                            HStack {
                                Image(systemName: "exclamationmark.triangle")
                                    .foregroundColor(.white)
                                    .font(.title)
                                Text(showMessageDetails ? "Supprimer" : "\(manager.messages.count) Messages")
                                    .foregroundColor(.white)
                            }
                            .padding(20)
                            .background(Color.blue)
                            .clipShape(RoundedRectangle(cornerRadius: 50, style: .circular))
                            .shadow(radius: 10)
                            .animation(.default, value: showMessageDetails)
                        }
                    }
                    
                }
            }
            .padding()
            
            VStack(alignment: .leading) {
                if manager.errors.count > 0 {
                    ScrollView {
                        VStack {
                            if showErrorDetails {
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
                        showErrorDetails.toggle()
                    } label: {
                        HStack {
                            Image(systemName: "xmark.octagon")
                                .foregroundColor(.white)
                                .font(.title)
                            Text(showErrorDetails ? "Fermer" : "\(manager.errors.count) Erreurs")
                                .foregroundColor(.white)
                        }
                        .padding(20)
                        .background(Color.red)
                        .clipShape(RoundedRectangle(cornerRadius: 50, style: .circular))
                        .shadow(radius: 10)
                        .animation(.default, value: showErrorDetails)
                    }
                }
                
            }
            .padding()
        }
    }
}

struct ErrorOverlay_Previews: PreviewProvider {
    static var previews: some View {
        ErrorOverlay()
    }
}
