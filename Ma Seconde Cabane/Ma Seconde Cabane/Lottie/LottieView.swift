//
//  LottieView.swift
//  Ma Seconde Cabane
//
//  Created by Arthur Guiot on 19/09/2022.
//

import SwiftUI
import Lottie

struct LottieView: UIViewRepresentable {
    let lottieFile: String
    var from: AnimationProgressTime? = nil
    var to: AnimationProgressTime = 1
    
    let animationView = AnimationView(configuration: .init(renderingEngine: .automatic))
    
    func makeUIView(context: Context) -> some UIView {
        let view = UIView(frame: .zero)
        
        animationView.animation = Animation.named(lottieFile)
        animationView.contentMode = .scaleAspectFit
        animationView.play(fromProgress: from, toProgress: to, loopMode: .autoReverse)
        
        view.addSubview(animationView)
        
        animationView.translatesAutoresizingMaskIntoConstraints = false
        animationView.heightAnchor.constraint(equalTo: view.heightAnchor).isActive = true
        animationView.widthAnchor.constraint(equalTo: view.widthAnchor).isActive = true
        
        return view
    }
    
    func updateUIView(_ uiView: UIViewType, context: Context) {
        
    }
}
