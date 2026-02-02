"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ImageUpload } from "@/components/image-upload"
import { getWeatherData } from "@/lib/weather"
import { cropTypes } from "@/lib/crop-data"

export default function PredictPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form data
  const [location, setLocation] = useState("")
  const [cropType, setCropType] = useState("")
  const [cropHealth, setCropHealth] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [weatherData, setWeatherData] = useState<any>(null)

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location.trim()) {
      setError("Please enter your location")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await getWeatherData(location)
      setWeatherData(data)
      sessionStorage.setItem("weatherData", JSON.stringify(data))
      sessionStorage.setItem("location", location)
      setStep(2)
    } catch (err) {
      setError("Could not fetch weather data. Please check your location and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCropSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cropType) {
      setError("Please select a crop type")
      return
    }
    setError("")
    sessionStorage.setItem("cropType", cropType)
    setStep(3)
  }

  // Update the handleAnalysisComplete function to handle verification failures
  const handleAnalysisComplete = (healthStatus: string, result: any) => {
    setCropHealth(healthStatus)
    setAnalysisResult(result)
    sessionStorage.setItem("cropHealth", healthStatus)
    sessionStorage.setItem("analysisResult", JSON.stringify(result))
  }

  const handleFinalSubmit = () => {
    if (!cropHealth || !analysisResult) {
      setError("Please complete the image analysis first")
      return
    }

    if (cropHealth === "verification_failed") {
      setError("Please upload correct images of your selected crop or change your crop selection")
      return
    }

    router.push("/results")
  }

  const goBack = () => {
    setError("")
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNum ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stepNum}
                    </div>
                    {stepNum < 3 && (
                      <div className={`w-16 h-1 mx-2 ${step > stepNum ? "bg-green-600" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Location</span>
                <span>Crop Type</span>
                <span>Image Analysis</span>
              </div>
            </div>

            {/* Step 1: Location */}
            {step === 1 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Step 1: Enter Your Location</CardTitle>
                  <CardDescription className="text-center">
                    We'll fetch current weather data for your farm area
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLocationSubmit}>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="location" className="text-lg">
                          Farm Location
                        </Label>
                        <Input
                          id="location"
                          placeholder="Enter city or town name (e.g., Des Moines, Iowa)"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="text-lg h-12 mt-2"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Enter your city, town, or nearest landmark for accurate weather data
                        </p>
                      </div>
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-lg h-12 w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Getting Weather Data...
                        </>
                      ) : (
                        <>
                          Next Step <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}

            {/* Step 2: Crop Type */}
            {step === 2 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Step 2: Select Your Crop</CardTitle>
                  <CardDescription className="text-center">Choose the type of crop you're growing</CardDescription>
                </CardHeader>
                <form onSubmit={handleCropSubmit}>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Weather Info */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Current Weather in {location}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p>Temperature: {weatherData?.main?.temp}°C</p>
                          <p>Humidity: {weatherData?.main?.humidity}%</p>
                          <p>Condition: {weatherData?.weather?.[0]?.main}</p>
                          <p>Pressure: {weatherData?.main?.pressure} hPa</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg">Crop Type</Label>
                        <Select value={cropType} onValueChange={setCropType}>
                          <SelectTrigger className="text-lg h-12 mt-2">
                            <SelectValue placeholder="Select your crop" />
                          </SelectTrigger>
                          <SelectContent>
                            {cropTypes.map((crop) => (
                              <SelectItem key={crop.value} value={crop.value} className="text-base">
                                {crop.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500 mt-1">Select the primary crop you want to analyze</p>
                      </div>
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={goBack} className="text-lg h-12">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-lg h-12">
                      Next Step <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}

            {/* Step 3: Image Upload and Analysis */}
            {step === 3 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Step 3: Crop Health Analysis</CardTitle>
                  <CardDescription className="text-center">
                    Upload images of your {cropTypes.find((c) => c.value === cropType)?.label} crop for AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Crop Info */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Selected Crop Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p>
                          <strong>Crop:</strong> {cropTypes.find((c) => c.value === cropType)?.label}
                        </p>
                        <p>
                          <strong>Location:</strong> {location}
                        </p>
                        <p>
                          <strong>Temperature:</strong> {weatherData?.main?.temp}°C
                        </p>
                        <p>
                          <strong>Humidity:</strong> {weatherData?.main?.humidity}%
                        </p>
                      </div>
                    </div>

                    <ImageUpload cropType={cropType} onAnalysisComplete={handleAnalysisComplete} />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goBack} className="text-lg h-12">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  {/* Update the final submit button to show verification status */}
                  <Button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="bg-green-600 hover:bg-green-700 text-lg h-12"
                    disabled={!cropHealth || !analysisResult || cropHealth === "verification_failed"}
                  >
                    {cropHealth === "verification_failed" ? (
                      <>
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Fix Verification Issues
                      </>
                    ) : (
                      <>
                        Get Predictions <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
