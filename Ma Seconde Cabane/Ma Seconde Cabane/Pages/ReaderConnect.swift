//
//  ContentView.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 12/09/2022.
//

import SwiftUI
import StripeTerminal

struct ReaderConnect: View {
    @EnvironmentObject var stripeController: StripeController
    
    func imageFor(reader: Reader) -> Image {
        switch reader.deviceType {
        case .stripeM2:
            return Image("stripe_m2")
        case .chipper1X, .chipper2X, .wiseCube:
            return Image("chipper")
        case .verifoneP400:
            return Image("verifone")
        case .wisePad3:
            return Image("wisepad")
        case .wisePosE, .etna, .S7:
            return Image("wisepose")
        @unknown default:
            return Image(systemName: "questionmark.app.dashed")
        }
    }
    
    func nameFor(reader: Reader) -> String {
        switch reader.deviceType {
        case .stripeM2:
            return "Stripe M2"
        case .chipper1X:
            return "Chipper 1X"
        case .chipper2X:
            return "Chipper 2X"
        case .wiseCube:
            return "Wise Cube"
        case .verifoneP400:
            return "Verifone P400"
        case .wisePad3:
            return "Wise Pad 3"
        case .wisePosE:
            return "Wise Pos E"
        case .etna:
            return "Etna"
        case .S7:
            return "S7"
        @unknown default:
            return "Unknown"
        }
    }
    
    @State var selectedReaderSerial = ""
    @State var simulated = false
    
    var body: some View {
        List {
            Toggle("Simulated", isOn: $simulated)
            Section {
                ForEach(stripeController.readers, id: \.serialNumber) { reader in
                    HStack {
                        imageFor(reader: reader)
                        Text(nameFor(reader: reader))
                        Spacer()
                        if selectedReaderSerial == reader.serialNumber {
                            ProgressView()
                        }
                    }
                    .contentShape(Rectangle())
                    .onTapGesture {
                        Task {
                            do {
                                self.selectedReaderSerial = reader.serialNumber
                                try await stripeController.connectToReader(selectedReader: reader)
                            } catch {
                                ErrorManager.shared.push(title: "Connect Reader", error: error)
                            }
                            self.selectedReaderSerial = ""
                        }
                    }
                }
            } header: {
                HStack {
                    ProgressView()
                    Text("Searching")
                        .padding()
                }
            }
        }
        .navigationTitle("Reader Discovery")
        .task(id: simulated) {
            await stripeController.discoverReaders(simulated: simulated)
        }
    }
}

struct ReaderConnect_Previews: PreviewProvider {
    static var previews: some View {
        ReaderConnect()
    }
}
