import Link from "next/link"
import { ArrowRight, Target, Users, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">About Farm Helper</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Empowering farmers with AI-driven insights to maximize crop yields and make informed agricultural
                decisions.
              </p>
            </div>

            {/* Mission */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Target className="h-6 w-6 mr-2 text-green-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  Farm Helper was created to bridge the gap between traditional farming knowledge and modern technology.
                  We believe that every farmer, regardless of their technical expertise, should have access to advanced
                  agricultural insights that can help them optimize their crop yields, reduce risks, and increase
                  profitability.
                </p>
              </CardContent>
            </Card>

            {/* How It Works */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center">How Farm Helper Works</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="bg-blue-100 p-3 rounded-full w-fit">
                      <span className="text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <CardTitle>Data Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Simply enter your farm location and select your crop type. Our system automatically fetches
                      real-time weather data and combines it with your crop health assessment.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="bg-green-100 p-3 rounded-full w-fit">
                      <span className="text-2xl font-bold text-green-600">2</span>
                    </div>
                    <CardTitle>AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our advanced algorithms analyze multiple factors including temperature, humidity, crop health, and
                      optimal growing conditions to generate accurate yield predictions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="bg-purple-100 p-3 rounded-full w-fit">
                      <span className="text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <CardTitle>Actionable Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Receive detailed recommendations for fertilizers, pest management, irrigation, and organic methods
                      tailored specifically to your crop and current conditions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Key Features</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                      AI-Powered Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>• Accurate yield predictions based on multiple factors</li>
                      <li>• Real-time weather data integration</li>
                      <li>• Crop-specific analysis algorithms</li>
                      <li>• Continuous learning and improvement</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      Comprehensive Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>• Fertilizer application guidelines</li>
                      <li>• Integrated pest management strategies</li>
                      <li>• Irrigation scheduling advice</li>
                      <li>• Organic farming methods</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      User-Friendly Interface
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>• Simple 3-step prediction process</li>
                      <li>• Visual dashboard with charts and graphs</li>
                      <li>• Mobile-responsive design</li>
                      <li>• No technical expertise required</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-purple-600" />
                      Crop-Specific Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>• Support for 15+ major crop types</li>
                      <li>• Optimal growing condition databases</li>
                      <li>• Pest and disease identification</li>
                      <li>• Seasonal growing recommendations</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Benefits */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Why Choose Farm Helper?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3">For Farmers</h4>
                    <ul className="space-y-2">
                      <li>✓ Increase crop yields by up to 20%</li>
                      <li>✓ Reduce input costs through optimized recommendations</li>
                      <li>✓ Make data-driven farming decisions</li>
                      <li>✓ Access expert knowledge anytime, anywhere</li>
                      <li>✓ Improve crop quality and market value</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-3">For Agriculture</h4>
                    <ul className="space-y-2">
                      <li>✓ Promote sustainable farming practices</li>
                      <li>✓ Reduce environmental impact</li>
                      <li>✓ Support food security initiatives</li>
                      <li>✓ Bridge technology gap in rural areas</li>
                      <li>✓ Enhance agricultural productivity</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center">Our Commitment</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed text-center">
                    Farm Helper is developed by a team of agricultural scientists, data scientists, and software
                    engineers who are passionate about revolutionizing agriculture through technology. We are committed
                    to providing accurate, reliable, and actionable insights that help farmers succeed in an
                    increasingly complex agricultural landscape.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Transform Your Farming?</h2>
              <p className="text-xl text-gray-600">
                Join thousands of farmers who are already using Farm Helper to optimize their crop yields.
              </p>
              <Link href="/predict">
                <Button className="bg-green-600 hover:bg-green-700 text-lg h-12 px-8">
                  Start Your Prediction <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
