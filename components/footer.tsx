import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">Farm Helper</span>
            </Link>
            <p className="text-green-100">
              Helping farmers make better decisions with AI-powered crop yield predictions and expert recommendations.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-green-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/predict" className="text-green-200 hover:text-white transition-colors">
                  Predict Yield
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-green-200 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>support@farmhelper.com</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📱</span>
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center">
          <p className="text-green-200">© 2024 Farm Helper. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
