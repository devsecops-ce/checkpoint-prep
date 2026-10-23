import SwiftUI
import WebKit
import UniformTypeIdentifiers

/// Hosts the bundled web app (www/) in a WKWebView.
/// Files are served from the custom `app://local/` origin so localStorage and login sessions persist reliably.
struct WebAppView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(BundleSchemeHandler(), forURLScheme: BundleSchemeHandler.scheme)
        config.websiteDataStore = .default()

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.uiDelegate = context.coordinator
        webView.navigationDelegate = context.coordinator
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsBackForwardNavigationGestures = false
        webView.isOpaque = false
        webView.backgroundColor = UIColor(named: "LaunchBackground")
        #if DEBUG
        if #available(iOS 16.4, *) { webView.isInspectable = true }
        #endif
        context.coordinator.webView = webView
        webView.load(URLRequest(url: URL(string: "\(BundleSchemeHandler.scheme)://local/index.html")!))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKUIDelegate, WKNavigationDelegate, WKDownloadDelegate {
        weak var webView: WKWebView?
        private var downloadURL: URL?

        // MARK: alert() / confirm() — WKWebView shows nothing unless the host implements these.
        func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String,
                     initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
            let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
            present(alert, orElse: completionHandler)
        }

        func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String,
                     initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
            let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(false) })
            alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
            present(alert, orElse: { completionHandler(false) })
        }

        private func present(_ vc: UIViewController, orElse fallback: @escaping () -> Void) {
            guard let root = Self.topViewController() else { fallback(); return }
            root.present(vc, animated: true)
        }

        static func topViewController() -> UIViewController? {
            let scene = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first
            var top = scene?.windows.first(where: \.isKeyWindow)?.rootViewController
            while let presented = top?.presentedViewController { top = presented }
            return top
        }

        // MARK: navigation — keep the app in-app, open real web links in Safari, handle CSV downloads.
        func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = action.request.url else { decisionHandler(.cancel); return }
            if action.shouldPerformDownload || url.scheme == "blob" {
                decisionHandler(.download); return
            }
            if url.scheme == BundleSchemeHandler.scheme || url.scheme == "about" {
                decisionHandler(.allow); return
            }
            if action.navigationType == .linkActivated, ["http", "https", "mailto"].contains(url.scheme ?? "") {
                UIApplication.shared.open(url)
                decisionHandler(.cancel); return
            }
            decisionHandler(.allow)
        }

        // target="_blank" links ask for a new window; open them in Safari instead.
        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
                     for action: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if let url = action.request.url, ["http", "https"].contains(url.scheme ?? "") {
                UIApplication.shared.open(url)
            }
            return nil
        }

        func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) {
            download.delegate = self
        }

        func download(_ download: WKDownload, decideDestinationUsing response: URLResponse,
                      suggestedFilename: String, completionHandler: @escaping (URL?) -> Void) {
            let url = FileManager.default.temporaryDirectory.appendingPathComponent(suggestedFilename)
            try? FileManager.default.removeItem(at: url)
            downloadURL = url
            completionHandler(url)
        }

        func downloadDidFinish(_ download: WKDownload) {
            guard let url = downloadURL, let root = Self.topViewController() else { return }
            let share = UIActivityViewController(activityItems: [url], applicationActivities: nil)
            share.popoverPresentationController?.sourceView = root.view
            share.popoverPresentationController?.sourceRect = CGRect(x: root.view.bounds.midX, y: 80, width: 1, height: 1)
            root.present(share, animated: true)
        }

        // Reload if the web content process is killed in the background.
        func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { webView.reload() }
    }
}

/// Serves files from the bundled `www` folder under app://local/...
final class BundleSchemeHandler: NSObject, WKURLSchemeHandler {
    static let scheme = "app"
    private let root = Bundle.main.resourceURL!.appendingPathComponent("www")

    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url else { return }
        var path = url.path.isEmpty || url.path == "/" ? "/index.html" : url.path
        path = path.removingPercentEncoding ?? path
        let file = root.appendingPathComponent(path).standardizedFileURL
        guard file.path.hasPrefix(root.standardizedFileURL.path), let data = try? Data(contentsOf: file) else {
            task.didFailWithError(URLError(.fileDoesNotExist)); return
        }
        let mime = UTType(filenameExtension: file.pathExtension)?.preferredMIMEType ?? "application/octet-stream"
        let headers = ["Content-Type": mime + (mime.hasPrefix("text/") || mime.contains("javascript") ? "; charset=utf-8" : ""),
                       "Content-Length": String(data.count)]
        task.didReceive(HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: headers)!)
        task.didReceive(data)
        task.didFinish()
    }

    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}
}
