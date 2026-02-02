import Link from "next/link"
import { ArrowRight, BarChart3, Leaf, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/placeholder.svg?height=800&width=1600&text=Beautiful+Green+Farm+Fields+with+Healthy+Crops')`,
          }}
        >
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white drop-shadow-lg">
                  Welcome Farmers! 🌾
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl drop-shadow-md">
                  Get AI-powered crop yield predictions and expert recommendations to maximize your harvest. Simply tell
                  us your location, crop type, and current conditions!
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/predict">
                  <Button className="bg-green-600 hover:bg-green-700 text-lg h-12 px-6 shadow-lg">
                    Start Prediction <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How Farm Helper Works</h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl mt-4">
                Three simple steps to get personalized farming recommendations
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <Droplets className="h-10 w-10 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Enter Your Location</h3>
                  <p className="text-gray-700">
                    Tell us where your farm is located and we'll automatically fetch current weather data for your area.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Leaf className="h-10 w-10 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Select Your Crop & Health</h3>
                  <p className="text-gray-700">
                    Choose your crop type and tell us about its current health condition for accurate analysis.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <BarChart3 className="h-10 w-10 text-yellow-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Get Predictions & Advice</h3>
                  <p className="text-gray-700">
                    Receive yield predictions and detailed recommendations to improve your crop health and maximize
                    harvest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Farm Helper?</h2>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>AI-powered yield predictions based on weather and crop conditions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Personalized recommendations for fertilizers, pest management, and organic methods</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Easy-to-use interface designed specifically for farmers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Completely free and accessible on any device</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Visual dashboard with charts and detailed analytics</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-gray-700 mb-6">
                  Join thousands of farmers who are already using Farm Helper to improve their crop yields and make
                  better farming decisions.
                </p>
                <Link href="/predict">
                  <Button className="bg-green-600 hover:bg-green-700 text-lg h-12 px-6">
                    Try Farm Helper Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
