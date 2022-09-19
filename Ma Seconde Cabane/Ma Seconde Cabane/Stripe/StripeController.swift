//
//  StripeController.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 15/09/2022.
//

import SwiftUI
import StripeTerminal

class StripeController: NSObject, ObservableObject {
    
    var discoverCancelable: Cancelable?
    var collectCancelable: Cancelable?
    
    
    enum ControllerState: Equatable {
        case idle
        case discovery
        case ready
        case readerInput(ReaderInputOptions)
        case readerDisplay(ReaderDisplayMessage)
        case success
    }
    
    @Published var state = ControllerState.idle
    @Published var readers = [Reader]()
    @Published var selectedReader: Reader? = nil
    
    func discoverReaders() async {
        let config = DiscoveryConfiguration(
            discoveryMethod: .bluetoothScan,
            simulated: true
        )
        self.state = .discovery
        self.readers = []
        self.discoverCancelable = Terminal.shared.discoverReaders(config, delegate: self) { error in
            if let error = error {
                print("discoverReaders failed: \(error)")
                self.state = .idle
            } else {
                print("discoverReaders succeeded")
                self.state = .ready
            }
        }
    }
    
    func collectPayment() async throws {
        let params = PaymentIntentParameters(amount: 1000,
                                             currency: "cad",
                                             paymentMethodTypes: ["card_present","interac_present"])
        
        let createResult = try await Terminal.shared.createPaymentIntent(params)
        
        Terminal.shared.collectPaymentMethod(createResult) { collectResult, collectError in
            if collectError != nil {
                print("collectPaymentMethod failed: \\(error)")
            } else if let paymentIntent = collectResult {
                print("collectPaymentMethod succeeded")
                
                Task {
                    try await self.processPayment(paymentIntent)
                }
            }
        }
    }
    
    private func processPayment(_ paymentIntent: PaymentIntent) async throws {
        let (result, error) = await Terminal.shared.processPayment(paymentIntent)
        if let error = error {
            throw error
        }
        guard let result = result else { return }
        // Notify your backend to capture the PaymentIntent.
        // PaymentIntents processed with Stripe Terminal must be captured
        // within 24 hours of processing the payment.
        try await APIClient.shared.capturePaymentIntent(result.stripeId)
        self.state = .success
    }
}

extension StripeController: DiscoveryDelegate {
    func terminal(_ terminal: Terminal, didUpdateDiscoveredReaders readers: [Reader]) {
        self.state = .discovery
        self.readers = readers
    }
    
    func connectToReader(selectedReader: Reader) async throws -> Reader {
        return try await withCheckedThrowingContinuation{ continuation in
            // Only connect if we aren't currently connected.
            guard Terminal.shared.connectionStatus == .notConnected else { return }
            
            let connectionConfig = BluetoothConnectionConfiguration(
                // When connecting to a physical reader, your integration should specify either the
                // same location as the last connection (selectedReader.locationId) or a new location
                // of your user's choosing.
                //
                // Since the simulated reader is not associated with a real location, we recommend
                // specifying its existing mock location.
                locationId: selectedReader.locationId!
            )
            Terminal.shared.connectBluetoothReader(selectedReader, delegate: self, connectionConfig: connectionConfig) { reader, error in
                if let reader = reader {
                    print("Successfully connected to reader: \(reader)")
                    self.selectedReader = reader
                    continuation.resume(returning: reader)
                } else if let error = error {
                    print("connectReader failed: \(error)")
                    continuation.resume(throwing: error)
                }
            }
        }
    }
}
extension StripeController: BluetoothReaderDelegate {
    func reader(_ reader: Reader, didRequestReaderInput inputOptions: ReaderInputOptions = []) {
//        readerMessageLabel.text = Terminal.stringFromReaderInputOptions(inputOptions)
        self.state = .readerInput(inputOptions)
    }
    
    func reader(_ reader: Reader, didRequestReaderDisplayMessage displayMessage: ReaderDisplayMessage) {
//        readerMessageLabel.text = Terminal.stringFromReaderDisplayMessage(displayMessage)
        self.state = .readerDisplay(displayMessage)
    }
    
    func reader(_ reader: Reader, didStartInstallingUpdate update: ReaderSoftwareUpdate, cancelable: Cancelable?) {
        // Show UI communicating that a required update has started installing
    }
    
    func reader(_ reader: Reader, didReportReaderSoftwareUpdateProgress progress: Float) {
        // Update the progress of the install
    }
    
    func reader(_ reader: Reader, didFinishInstallingUpdate update: ReaderSoftwareUpdate?, error: Error?) {
        // Report success or failure of the update
    }
    
    func reader(_ reader: Reader, didReportAvailableUpdate update: ReaderSoftwareUpdate) {
        // Show UI communicating that an update is available
    }
}