//
//  BigButtonStyle.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 18/09/2022.
//

import SwiftUI

struct BigButtonStyle: ButtonStyle {
    var color: Color
    init(color: Color = .blue) {
        self.color = color
    }
    func makeBody(configuration: Self.Configuration) -> some View {
        HStack {
            Spacer()
            configuration.label
                .padding()
                .foregroundColor(Color.white)
            Spacer()
        }
        .background(color)
        .clipShape(Rectangle())
    }
}
