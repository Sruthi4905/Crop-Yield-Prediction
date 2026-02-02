// Weather data fetching with mock implementation
export async function getWeatherData(location: string) {
  try {
    // In production, you would use a real weather API like OpenWeatherMap
    // const apiKey = process.env.OPENWEATHER_API_KEY
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)

    // For demo purposes, we'll use mock data
    return getMockWeatherData(location)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return getMockWeatherData(location)
  }
}

function getMockWeatherData(location: string) {
  // Generate realistic weather data based on location
  const baseTemp = getBaseTemperature(location)
  const temp = baseTemp + (Math.random() * 10 - 5) // ±5°C variation
  const humidity = Math.floor(Math.random() * 40) + 40 // 40-80%
  const pressure = Math.floor(Math.random() * 50) + 1000 // 1000-1050 hPa

  const weatherConditions = ["Clear", "Clouds", "Rain", "Drizzle"]
  const weights = [0.4, 0.3, 0.2, 0.1] // Probability weights
  const randomWeather = getWeightedRandom(weatherConditions, weights)

  return {
    name: location,
    main: {
      temp: Math.round(temp * 10) / 10,
      feels_like: Math.round((temp - 2) * 10) / 10,
      temp_min: Math.round((temp - 5) * 10) / 10,
      temp_max: Math.round((temp + 5) * 10) / 10,
      pressure: pressure,
      humidity: humidity,
    },
    weather: [
      {
        main: randomWeather,
        description: randomWeather.toLowerCase(),
      },
    ],
  }
}

function getBaseTemperature(location: string): number {
  // Simple temperature estimation based on location
  const locationLower = location.toLowerCase()

  if (locationLower.includes("miami") || locationLower.includes("phoenix")) return 28
  if (locationLower.includes("seattle") || locationLower.includes("portland")) return 15
  if (locationLower.includes("chicago") || locationLower.includes("detroit")) return 18
  if (locationLower.includes("los angeles") || locationLower.includes("san diego")) return 22
  if (locationLower.includes("new york") || locationLower.includes("boston")) return 20

  // Default temperature
  return 22
}

function getWeightedRandom(items: string[], weights: number[]): string {
  const random = Math.random()
  let weightSum = 0

  for (let i = 0; i < items.length; i++) {
    weightSum += weights[i]
    if (random <= weightSum) {
      return items[i]
    }
  }

  return items[0]
}
