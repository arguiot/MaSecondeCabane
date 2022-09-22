//
//  Locations.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 21/09/2022.
//

import SwiftUI
import StripeTerminal

struct Locations: View {
    @State var locations = [APIClient.LocationObject]()
    @State var showSheet = false
    @State var showReaders = false
    
    @EnvironmentObject var stripeController: StripeController
    
    func refresh() async {
        do {
            self.locations = try await APIClient.shared.listLocations()
        } catch {
            guard stripeController.selectedReader == nil else { return }
            ErrorManager.shared.push(title: "List Locations", error: error)
        }
    }
    
    @State var testMode = false
    
    var body: some View {
        List {
            Section("Environment") {
                Toggle("Mode Test", isOn: $testMode)
                    .task(id: testMode) {
                        APIClient.shared.baseURLString = testMode ? "https://dev.masecondecabane.com/api/pos/" : "https://masecondecabane.com/api/pos/"
                        Terminal.shared.clearCachedCredentials()
                        await refresh()
                    }
            }
            Section("Veuillez choisir ou créer un emplacement pour le magasin") {
                ForEach(locations, id: \.id) { location in
                    NavigationLink {
                        ReaderConnect()
                            .task {
                                stripeController.locationID = location.id
                            }
                    } label: {
                        VStack(alignment: .leading) {
                            Text(location.display_name)
                                .bold()
                            Text(location.address.line1)
                        }
                    }
                }
                .onDelete { indexSet in
                    Task {
                        do {
                            for i in indexSet {
                                let id = self.locations[i].id
                                try await APIClient.shared.deleteLocation(locationId: id)
                            }
                        } catch {
                            ErrorManager.shared.push(title: "Delete Locations", error: error)
                        }
                    }
                }
                Button("Nouvel emplacement") {
                    showSheet.toggle()
                }

            }
        }
        .refreshable { await refresh() }
        .navigationTitle("Emplacements")
        .task { await refresh() }
        .sheet(isPresented: $showSheet) { Task { await refresh() } } content: {
            LocationForm(showSheet: $showSheet)
        }

    }
}

struct LocationForm: View {
    @State var displayName = ""
    @State var line1 = ""
    @State var line2 = ""
    @State var postal_code = ""
    @State var city = "Montreal"
    @State var state = "QC"
    @State var country = "CA"
    
    @State var processing = false
    @Binding var showSheet: Bool
    
    var body: some View {
        NavigationView {
            Form {
                Section("Titre") {
                    TextField("Nom de l'emplacement", text: $displayName)
                }
                Section("Addresse") {
                    TextField("Ligne 1", text: $line1)
                    TextField("Ligne 2", text: $line2)
                    TextField("Code Postal", text: $postal_code)
                    TextField("Ville", text: $city)
                    TextField("Région", text: $state)
                    TextField("Pays", text: $country)
                }
                Button("Valider") {
                    self.processing = true
                    Task {
                        do {
                            let address = APIClient.Location.Address(city: city, country: country, line1: line1, line2: line2 == "" ? nil : line2, postal_code: postal_code, state: state)
                            try await APIClient.shared.createLocation(location: APIClient.Location(display_name: displayName, address: address))
                            self.showSheet = false
                        } catch {
                            ErrorManager.shared.push(title: "Create Location", error: error)
                        }
                        self.processing = false
                    }
                }
                .disabled(processing)
            }
            .navigationTitle("Nouvel emplacement")
        }
    }
}

struct Locations_Previews: PreviewProvider {
    static var previews: some View {
        Locations()
    }
}
