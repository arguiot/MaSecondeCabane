//
//  ContentView.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 12/09/2022.
//

import SwiftUI
import StripeTerminal
import BatteryView

struct ContentView: View {
    @StateObject var stripeController = StripeController()
    
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
    func batteryStatusConvert(reader: Reader) -> BatteryState {
        if reader.batteryStatus == .unknown {
            return .unknown
        }
        if reader.isCharging == 1 {
            return .charging
        }
        if reader.batteryLevel == 1 {
            return .full
        }
        return .unplugged
    }
    
    @State var selectedReaderSerial = ""
    
    var body: some View {
        NavigationView {
            if stripeController.state == .discovery {
                VStack {
                    List(stripeController.readers, id: \.serialNumber) { reader in
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
                                    stripeController.state = .ready
                                } catch {
                                    print(error)
                                }
                            }
                        }
                    }
                    .navigationTitle(.constant("Reader Discovery"))
                    ProgressView("Searching")
                }
            }
            if stripeController.state == .ready, let selectedReader = stripeController.selectedReader {
                VStack {
                    HStack {
                        imageFor(reader: selectedReader)
                            .resizable()
                            .frame(width: 100, height: 100)
                        VStack(alignment: .leading) {
                            Battery(.constant(Float(selectedReader.batteryLevel ?? 0)),
                                    .constant(batteryStatusConvert(reader: selectedReader))
                            )
                            .frame(height: 10)
                            Text("Serial Number: ") + Text(selectedReader.serialNumber)
                            Text("Software: ") + Text(selectedReader.deviceSoftwareVersion ?? "Unknown")
                        }
                    }
                    Spacer()
                    Button("Commencer à scanner") {
                        // Start Scanning
                    }
                    .buttonStyle(BigButtonStyle())
                }
                .navigationTitle(Text(nameFor(reader: selectedReader)))
            }
        }
        .navigationViewStyle(.stack)
        .environmentObject(stripeController)
        .task {
            await stripeController.discoverReaders()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
