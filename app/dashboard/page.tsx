"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Thermometer, Droplets, Wind } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Line } from "react-chartjs-2"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getCropInfo, cropTypes } from "@/lib/crop-data"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export default function DashboardPage() {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [cropHealth, setCropHealth] = useState("")
  const [cropType, setCropType] = useState("")
  const [location, setLocation] = useState("")
  const [cropInfo, setCropInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get data from session storage
    const storedWeatherData = sessionStorage.getItem("weatherData")
    const storedCropHealth = sessionStorage.getItem("cropHealth")
    const storedCropType = sessionStorage.getItem("cropType")
    const storedLocation = sessionStorage.getItem("location")

    if (storedWeatherData && storedCropHealth && storedCropType && storedLocation) {
      setWeatherData(JSON.parse(storedWeatherData))
      setCropHealth(storedCropHealth)
      setCropType(storedCropType)
      setLocation(storedLocation)

      // Get crop information
      const info = getCropInfo(storedCropType)
      setCropInfo(info)
    }

    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Loading dashboard...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!weatherData || !cropType) {
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

  const cropLabel = cropTypes.find((c) => c.value === cropType)?.label || cropType

  // Temperature comparison chart
  const tempChartData = {
    labels: ["Current", "Optimal", "Min Today", "Max Today"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [weatherData.main.temp, cropInfo.optimalTemp, weatherData.main.temp_min, weatherData.main.temp_max],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 75, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: ["rgb(54, 162, 235)", "rgb(75, 192, 75)", "rgb(255, 99, 132)", "rgb(255, 159, 64)"],
        borderWidth: 2,
      },
    ],
  }

  // Humidity comparison chart
  const humidityChartData = {
    labels: ["Current Humidity", "Optimal Humidity"],
    datasets: [
      {
        label: "Humidity (%)",
        data: [weatherData.main.humidity, cropInfo.optimalHumidity],
        backgroundColor: ["rgba(153, 102, 255, 0.6)", "rgba(75, 192, 75, 0.6)"],
        borderColor: ["rgb(153, 102, 255)", "rgb(75, 192, 75)"],
        borderWidth: 2,
      },
    ],
  }

  // Mock historical data for trend analysis
  const historicalData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Current"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [22, 24, 26, 25, weatherData.main.temp],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
      {
        label: "Humidity (%)",
        data: [65, 70, 68, 72, weatherData.main.humidity],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Farm Dashboard</CardTitle>
                <CardDescription>
                  Analytics for {cropLabel} in {location}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Temperature</CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weatherData.main.temp}°C</div>
                  <p className="text-xs text-muted-foreground">Optimal: {cropInfo.optimalTemp}°C</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weatherData.main.humidity}%</div>
                  <p className="text-xs text-muted-foreground">Optimal: {cropInfo.optimalHumidity}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pressure</CardTitle>
                  <Wind className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weatherData.main.pressure}</div>
                  <p className="text-xs text-muted-foreground">hPa</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crop Health</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{cropHealth}</div>
                  <p className="text-xs text-muted-foreground">
                    {cropHealth === "excellent"
                      ? "Thriving"
                      : cropHealth === "good"
                        ? "Healthy"
                        : cropHealth === "fair"
                          ? "Needs attention"
                          : "Requires care"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Analysis</CardTitle>
                  <CardDescription>Current vs optimal temperature conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar data={tempChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Humidity Comparison</CardTitle>
                  <CardDescription>Current vs optimal humidity levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar data={humidityChartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historical Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Weather Trends</CardTitle>
                <CardDescription>Temperature and humidity trends over the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={historicalData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Crop Information */}
            <Card>
              <CardHeader>
                <CardTitle>Crop Information</CardTitle>
                <CardDescription>Detailed information about your {cropLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Growing Details</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <strong>Season:</strong> {cropInfo.season}
                      </li>
                      <li>
                        <strong>Water Needs:</strong> {cropInfo.waterNeeds}
                      </li>
                      <li>
                        <strong>Maturity:</strong> {cropInfo.maturityDays} days
                      </li>
                      <li>
                        <strong>Soil Type:</strong> {cropInfo.soilType}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Common Pests</h4>
                    <ul className="space-y-1 text-sm">
                      {cropInfo.commonPests.map((pest: string, index: number) => (
                        <li key={index}>• {pest}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Common Diseases</h4>
                    <ul className="space-y-1 text-sm">
                      {cropInfo.commonDiseases.map((disease: string, index: number) => (
                        <li key={index}>• {disease}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/results">
                <Button variant="outline" className="text-lg h-12 px-6">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Results
                </Button>
              </Link>
              <Link href="/predict">
                <Button className="bg-green-600 hover:bg-green-700 text-lg h-12 px-6">New Prediction</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
