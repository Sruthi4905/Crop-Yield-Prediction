"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, TrendingUp, Droplets, Bug, Leaf, Zap, Camera, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { calculateYield, getRecommendations } from "@/lib/prediction"
import { getCropInfo, cropTypes } from "@/lib/crop-data"

export default function ResultsPage() {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [cropHealth, setCropHealth] = useState("")
  const [cropType, setCropType] = useState("")
  const [location, setLocation] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [yieldPrediction, setYieldPrediction] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [cropInfo, setCropInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get data from session storage
    const storedWeatherData = sessionStorage.getItem("weatherData")
    const storedCropHealth = sessionStorage.getItem("cropHealth")
    const storedCropType = sessionStorage.getItem("cropType")
    const storedLocation = sessionStorage.getItem("location")
    const storedAnalysisResult = sessionStorage.getItem("analysisResult")

    if (storedWeatherData && storedCropHealth && storedCropType && storedLocation) {
      const parsedWeatherData = JSON.parse(storedWeatherData)
      const parsedAnalysisResult = storedAnalysisResult ? JSON.parse(storedAnalysisResult) : null

      setWeatherData(parsedWeatherData)
      setCropHealth(storedCropHealth)
      setCropType(storedCropType)
      setLocation(storedLocation)
      setAnalysisResult(parsedAnalysisResult)

      // Get crop information
      const info = getCropInfo(storedCropType)
      setCropInfo(info)

      // Calculate yield prediction
      const prediction = calculateYield(parsedWeatherData, storedCropHealth, storedCropType)
      setYieldPrediction(prediction)

      // Get recommendations
      const recs = getRecommendations(parsedWeatherData, storedCropHealth, storedCropType, prediction)
      setRecommendations(recs)
    }

    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Loading your results...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!weatherData || !cropHealth || !cropType) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">No Data Found</CardTitle>
              <CardDescription>Please complete the prediction form first</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/predict">
                <Button className="bg-green-600 hover:bg-green-700 text-lg h-12 w-full">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Go to Prediction Form
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const getBgColor = () => {
    switch (yieldPrediction?.level) {
      case "High":
        return "bg-green-100 border-green-300"
      case "Medium":
        return "bg-yellow-100 border-yellow-300"
      case "Low":
        return "bg-red-100 border-red-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getTextColor = () => {
    switch (yieldPrediction?.level) {
      case "High":
        return "text-green-800"
      case "Medium":
        return "text-yellow-800"
      case "Low":
        return "text-red-800"
      default:
        return "text-gray-800"
    }
  }

  const getHealthBadgeColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const cropLabel = cropTypes.find((c) => c.value === cropType)?.label || cropType

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">AI-Powered Crop Analysis Results</CardTitle>
                <CardDescription>
                  Comprehensive analysis for {cropLabel} in {location} based on image analysis and weather conditions
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Current Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Droplets className="h-5 w-5 mr-2 text-blue-600" />
                    Weather
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Temperature:</strong> {weatherData.main.temp}°C
                    </p>
                    <p>
                      <strong>Humidity:</strong> {weatherData.main.humidity}%
                    </p>
                    <p>
                      <strong>Condition:</strong> {weatherData.weather[0].main}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-green-600" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <strong>Health:</strong>
                      <Badge className={getHealthBadgeColor(cropHealth)}>{cropHealth}</Badge>
                    </div>
                    {analysisResult && (
                      <>
                        <p>
                          <strong>Confidence:</strong> {Math.round(analysisResult.confidence * 100)}%
                        </p>
                        <p>
                          <strong>Growth Stage:</strong> {analysisResult.growthStage}
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    Optimal Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Temp:</strong> {cropInfo.optimalTemp}°C
                    </p>
                    <p>
                      <strong>Humidity:</strong> {cropInfo.optimalHumidity}%
                    </p>
                    <p>
                      <strong>Water:</strong> {cropInfo.waterNeeds}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image Analysis Results */}
            {analysisResult && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Image Analysis Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Analysis Summary</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Health Score:</strong> {Math.round(analysisResult.healthScore * 100)}/100
                        </p>
                        <p>
                          <strong>Growth Stage:</strong> {analysisResult.growthStage}
                        </p>
                        <p>
                          <strong>Images Analyzed:</strong> {analysisResult.analysisDetails?.length || 0}
                        </p>
                      </div>
                    </div>

                    {analysisResult.detectedIssues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Detected Issues</h4>
                        <ul className="text-sm space-y-1">
                          {analysisResult.detectedIssues.map((issue: string, index: number) => (
                            <li key={index} className="text-red-700">
                              • {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Yield Prediction */}
            <Card className={`border-2 ${getBgColor()}`}>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2" />
                  Yield Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className={`text-6xl font-bold ${getTextColor()}`}>{yieldPrediction.level}</div>
                  <div className="space-y-2">
                    <p className="text-2xl font-semibold">Expected Yield: {yieldPrediction.percentage}%</p>
                    <Progress value={yieldPrediction.percentage} className="w-full h-3" />
                    <p className="text-sm text-gray-600">
                      Based on AI image analysis, weather conditions, crop health, and optimal growing parameters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Detailed Recommendations</CardTitle>
                <CardDescription>AI-powered personalized advice to improve your crop yield and health</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general" className="flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      General
                    </TabsTrigger>
                    <TabsTrigger value="fertilizer" className="flex items-center">
                      <Leaf className="h-4 w-4 mr-1" />
                      Fertilizer
                    </TabsTrigger>
                    <TabsTrigger value="pest" className="flex items-center">
                      <Bug className="h-4 w-4 mr-1" />
                      Pest Control
                    </TabsTrigger>
                    <TabsTrigger value="irrigation" className="flex items-center">
                      <Droplets className="h-4 w-4 mr-1" />
                      Irrigation
                    </TabsTrigger>
                    <TabsTrigger value="organic" className="flex items-center">
                      <Leaf className="h-4 w-4 mr-1" />
                      Organic
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="mt-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">General Farming Advice</h3>
                      <ul className="space-y-3">
                        {recommendations?.general?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-3 mt-1">•</span>
                            <span className="text-lg">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="fertilizer" className="mt-6">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Fertilizer Recommendations</h3>
                      <ul className="space-y-3">
                        {recommendations?.fertilizer?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-3 mt-1">•</span>
                            <span className="text-lg">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="pest" className="mt-6">
                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Pest Management</h3>
                      <ul className="space-y-3">
                        {recommendations?.pestManagement?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-3 mt-1">•</span>
                            <span className="text-lg">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="irrigation" className="mt-6">
                    <div className="bg-cyan-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Irrigation Management</h3>
                      <ul className="space-y-3">
                        {recommendations?.irrigation?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-3 mt-1">•</span>
                            <span className="text-lg">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="organic" className="mt-6">
                    <div className="bg-emerald-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Organic Methods</h3>
                      <ul className="space-y-3">
                        {recommendations?.organic?.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-3 mt-1">•</span>
                            <span className="text-lg">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/predict">
                <Button variant="outline" className="text-lg h-12 px-6">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  New Prediction
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700 text-lg h-12 px-6">
                  View Dashboard <BarChart3 className="ml-2 h-5 w-5" />
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
