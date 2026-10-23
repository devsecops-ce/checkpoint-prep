import SwiftUI

@main
struct CheckpointPrepApp: App {
    var body: some Scene {
        WindowGroup {
            WebAppView()
                .ignoresSafeArea()
                .background(Color("LaunchBackground"))
        }
    }
}
