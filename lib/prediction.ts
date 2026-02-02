import { getCropInfo } from "./crop-data"

export function calculateYield(weatherData: any, cropHealth: string, cropType: string) {
  const temperature = weatherData.main.temp
  const humidity = weatherData.main.humidity
  const weatherCondition = weatherData.weather[0].main

  const cropInfo = getCropInfo(cropType)
  const optimalTemp = cropInfo.optimalTemp
  const optimalHumidity = cropInfo.optimalHumidity

  // Calculate temperature factor (0-1)
  const tempDiff = Math.abs(temperature - optimalTemp)
  const tempFactor = tempDiff > 15 ? 0.3 : tempDiff > 10 ? 0.6 : tempDiff > 5 ? 0.8 : 1

  // Calculate humidity factor (0-1)
  const humidityDiff = Math.abs(humidity - optimalHumidity)
  const humidityFactor = humidityDiff > 30 ? 0.4 : humidityDiff > 20 ? 0.7 : humidityDiff > 10 ? 0.9 : 1

  // Weather condition factor
  let weatherFactor = 1
  if (weatherCondition === "Rain" || weatherCondition === "Drizzle") {
    weatherFactor = cropInfo.waterNeeds === "High" ? 0.9 : 0.8
  } else if (weatherCondition === "Thunderstorm") {
    weatherFactor = 0.5
  } else if (weatherCondition === "Clear" && temperature > optimalTemp + 5) {
    weatherFactor = 0.7
  }

  // Crop health factor
  const cropHealthFactor =
    cropHealth === "excellent" ? 1 : cropHealth === "good" ? 0.8 : cropHealth === "fair" ? 0.6 : 0.4

  // Calculate overall yield factor
  const yieldFactor = (tempFactor + humidityFactor + weatherFactor + cropHealthFactor) / 4

  // Determine yield prediction with percentage
  if (yieldFactor >= 0.8) {
    return { level: "High", percentage: Math.round(85 + (yieldFactor - 0.8) * 75), factor: yieldFactor }
  } else if (yieldFactor >= 0.6) {
    return { level: "Medium", percentage: Math.round(60 + (yieldFactor - 0.6) * 125), factor: yieldFactor }
  } else {
    return { level: "Low", percentage: Math.round(30 + yieldFactor * 50), factor: yieldFactor }
  }
}

export function getRecommendations(weatherData: any, cropHealth: string, cropType: string, yieldPrediction: any) {
  const recommendations = {
    general: getGeneralAdvice(weatherData, cropHealth, cropType, yieldPrediction),
    fertilizer: getFertilizerRecommendations(cropType, cropHealth, weatherData, yieldPrediction),
    pestManagement: getPestManagement(cropType, cropHealth, yieldPrediction),
    irrigation: getIrrigationAdvice(weatherData, cropType, yieldPrediction),
    organic: getOrganicMethods(cropType, cropHealth, yieldPrediction),
  }

  return recommendations
}

function getGeneralAdvice(weatherData: any, cropHealth: string, cropType: string, yieldPrediction: any) {
  const advice: string[] = []
  const cropInfo = getCropInfo(cropType)
  const temperature = weatherData.main.temp
  const humidity = weatherData.main.humidity

  // Yield-based advice
  if (yieldPrediction.level === "High") {
    advice.push("🎉 Excellent! Your conditions are optimal for high yield. Maintain current practices.")
    advice.push("Focus on consistent monitoring and preventive measures to sustain this performance.")
  } else if (yieldPrediction.level === "Medium") {
    advice.push("⚠️ Good potential, but there's room for improvement to achieve higher yields.")
    advice.push("Consider implementing the specific recommendations below to boost your yield.")
  } else {
    advice.push("🚨 Current conditions may result in lower yields. Immediate action recommended.")
    advice.push("Follow the detailed recommendations below to improve your crop's performance.")
  }

  // Temperature-specific advice
  if (Math.abs(temperature - cropInfo.optimalTemp) > 5) {
    if (temperature > cropInfo.optimalTemp) {
      advice.push(
        `🌡️ Temperature is ${Math.round(temperature - cropInfo.optimalTemp)}°C above optimal. Provide shade and increase irrigation frequency.`,
      )
    } else {
      advice.push(
        `🌡️ Temperature is ${Math.round(cropInfo.optimalTemp - temperature)}°C below optimal. Consider protective covers and reduce watering.`,
      )
    }
  }

  // Humidity-specific advice
  if (Math.abs(humidity - cropInfo.optimalHumidity) > 15) {
    if (humidity > cropInfo.optimalHumidity) {
      advice.push(`💧 Humidity is high (${humidity}%). Ensure good air circulation and watch for fungal diseases.`)
    } else {
      advice.push(`💧 Humidity is low (${humidity}%). Increase watering and consider mulching to retain moisture.`)
    }
  }

  // Health-specific advice
  if (cropHealth === "poor") {
    advice.push("🏥 Immediate intervention needed. Check for diseases, pests, and nutrient deficiencies.")
    advice.push("Consider consulting with a local agricultural extension officer.")
  } else if (cropHealth === "fair") {
    advice.push("📈 Your crop needs attention. Regular monitoring and targeted treatments will help.")
  }

  return advice
}

function getFertilizerRecommendations(cropType: string, cropHealth: string, weatherData: any, yieldPrediction: any) {
  const recommendations: string[] = []
  const temperature = weatherData.main.temp
  const humidity = weatherData.main.humidity

  // Base recommendations by crop type
  const fertilizerGuide: Record<string, any> = {
    rice: {
      nitrogen: "120-150 kg/ha in 3-4 splits",
      phosphorus: "60-80 kg/ha at transplanting",
      potassium: "40-60 kg/ha",
      micronutrients: "Zinc sulfate 25 kg/ha",
    },
    wheat: {
      nitrogen: "120-140 kg/ha in 2-3 splits",
      phosphorus: "60-80 kg/ha at sowing",
      potassium: "40-50 kg/ha",
      micronutrients: "Zinc sulfate 20 kg/ha",
    },
    corn: {
      nitrogen: "150-200 kg/ha in 3-4 splits",
      phosphorus: "80-100 kg/ha at sowing",
      potassium: "60-80 kg/ha",
      micronutrients: "Zinc and boron supplements",
    },
    // Add more crops as needed
  }

  const guide = fertilizerGuide[cropType] || {
    nitrogen: "100-120 kg/ha in 2-3 splits",
    phosphorus: "60 kg/ha at sowing",
    potassium: "40 kg/ha",
    micronutrients: "As per soil test",
  }

  // Adjust based on yield prediction
  if (yieldPrediction.level === "Low") {
    recommendations.push("🔴 Immediate fertilizer intervention needed:")
    recommendations.push(`• Nitrogen: Increase to ${guide.nitrogen} (split application recommended)`)
    recommendations.push(`• Phosphorus: ${guide.phosphorus} for root development`)
    recommendations.push(`• Potassium: ${guide.potassium} for stress tolerance`)
    recommendations.push("• Consider foliar application of micronutrients for quick uptake")
  } else if (yieldPrediction.level === "Medium") {
    recommendations.push("🟡 Balanced fertilization for yield improvement:")
    recommendations.push(`• Nitrogen: ${guide.nitrogen}`)
    recommendations.push(`• Phosphorus: ${guide.phosphorus}`)
    recommendations.push(`• Potassium: ${guide.potassium}`)
  } else {
    recommendations.push("🟢 Maintenance fertilization:")
    recommendations.push(`• Continue current NPK schedule: ${guide.nitrogen}`)
    recommendations.push("• Focus on micronutrient balance")
  }

  // Weather-based adjustments
  if (temperature > 30) {
    recommendations.push("🌡️ High temperature adjustment: Increase potassium for heat stress tolerance")
  }

  if (humidity > 80) {
    recommendations.push("💧 High humidity: Reduce nitrogen to prevent excessive vegetative growth")
  }

  // Health-based adjustments
  if (cropHealth === "poor") {
    recommendations.push("🏥 Emergency nutrition: Apply liquid fertilizer for quick absorption")
    recommendations.push("• Foliar spray of 19:19:19 NPK @ 5g/liter every 10 days")
  }

  recommendations.push("\n📋 Application Guidelines:")
  recommendations.push("• Apply fertilizers during cool hours (early morning/evening)")
  recommendations.push("• Ensure adequate soil moisture before application")
  recommendations.push("• Split nitrogen applications to reduce losses")

  return recommendations
}

function getPestManagement(cropType: string, cropHealth: string, yieldPrediction: any) {
  const recommendations: string[] = []

  // Preventive measures for healthy crops
  if (cropHealth === "excellent" || cropHealth === "good") {
    recommendations.push("🛡️ Preventive Pest Management:")
    recommendations.push("• Regular field monitoring (2-3 times per week)")
    recommendations.push("• Install pheromone traps for early pest detection")
    recommendations.push("• Maintain field hygiene and remove crop residues")
    recommendations.push("• Encourage beneficial insects with flowering plants nearby")
  } else {
    recommendations.push("⚠️ Active Pest Management Required:")
  }

  // Crop-specific recommendations
  const pestGuide: Record<string, string[]> = {
    rice: [
      "• Neem oil spray (30ml/liter) for stem borer and brown planthopper",
      "• Trichoderma application for blast disease prevention",
      "• Light traps for night-flying pests",
      "• Maintain 2-3 cm water level to control certain pests",
    ],
    wheat: [
      "• Insecticidal soap for aphid control",
      "• Sulfur dusting for powdery mildew",
      "• Crop rotation to break pest cycles",
      "• Yellow sticky traps for flying pests",
    ],
    corn: [
      "• Bt spray for corn borer management",
      "• Neem-based pesticides for armyworm",
      "• Fall armyworm pheromone traps",
      "• Regular inspection of whorl and ears",
    ],
    cotton: [
      "• Bollworm monitoring with pheromone traps",
      "• Neem oil for whitefly and aphid control",
      "• Intercropping with marigold for pest deterrence",
      "• Regular removal of damaged bolls",
    ],
    tomato: [
      "• Copper-based fungicides for early/late blight",
      "• Neem oil for whitefly and aphid management",
      "• Staking and pruning for better air circulation",
      "• Yellow sticky traps in greenhouse/polyhouse",
    ],
  }

  const specificAdvice = pestGuide[cropType] || [
    "• Regular monitoring for pest and disease symptoms",
    "• Use of organic pesticides like neem oil",
    "• Proper sanitation and field hygiene",
    "• Integrated pest management approach",
  ]

  recommendations.push(...specificAdvice)

  // Yield-based intensity
  if (yieldPrediction.level === "Low") {
    recommendations.push("\n🚨 Intensive Management:")
    recommendations.push("• Daily monitoring recommended")
    recommendations.push("• Consider professional pest scouting")
    recommendations.push("• Apply treatments at first sign of infestation")
  }

  recommendations.push("\n⏰ Application Timing:")
  recommendations.push("• Early morning (6-8 AM) or evening (4-6 PM)")
  recommendations.push("• Avoid application during flowering for bee safety")
  recommendations.push("• Follow label instructions for dosage and frequency")

  return recommendations
}

function getIrrigationAdvice(weatherData: any, cropType: string, yieldPrediction: any) {
  const recommendations: string[] = []
  const cropInfo = getCropInfo(cropType)
  const weatherCondition = weatherData.weather[0].main
  const humidity = weatherData.main.humidity

  // Base irrigation schedule
  if (cropInfo.waterNeeds === "High") {
    recommendations.push("💧 High Water Requirement Crop:")
    recommendations.push("• Maintain consistent soil moisture (80-90% field capacity)")
    recommendations.push("• Irrigate every 2-3 days during peak growth")
  } else if (cropInfo.waterNeeds === "Medium") {
    recommendations.push("💧 Moderate Water Requirement:")
    recommendations.push("• Maintain soil moisture at 70-80% field capacity")
    recommendations.push("• Irrigate every 4-5 days or as needed")
  } else {
    recommendations.push("💧 Low Water Requirement:")
    recommendations.push("• Allow soil to dry between irrigations")
    recommendations.push("• Irrigate every 7-10 days or based on soil moisture")
  }

  // Weather-based adjustments
  if (weatherCondition === "Rain" || weatherCondition === "Drizzle") {
    recommendations.push("🌧️ Recent rainfall detected:")
    recommendations.push("• Reduce or skip next irrigation")
    recommendations.push("• Ensure proper drainage to prevent waterlogging")
    recommendations.push("• Monitor for fungal diseases due to high moisture")
  } else if (weatherCondition === "Clear" && humidity < 50) {
    recommendations.push("☀️ Hot and dry conditions:")
    recommendations.push("• Increase irrigation frequency")
    recommendations.push("• Consider mulching to reduce evaporation")
    recommendations.push("• Irrigate during early morning or evening")
  }

  // Yield-based adjustments
  if (yieldPrediction.level === "Low") {
    recommendations.push("\n🚨 Critical irrigation management:")
    recommendations.push("• Monitor soil moisture daily")
    recommendations.push("• Avoid water stress during critical growth stages")
    recommendations.push("• Consider drip irrigation for water efficiency")
  }

  // Crop-specific timing
  const criticalStages: Record<string, string[]> = {
    rice: ["Tillering", "Panicle initiation", "Grain filling"],
    wheat: ["Crown root initiation", "Jointing", "Grain filling"],
    corn: ["Tasseling", "Silking", "Grain filling"],
    cotton: ["Squaring", "Flowering", "Boll development"],
    tomato: ["Flowering", "Fruit set", "Fruit development"],
  }

  const stages = criticalStages[cropType] || ["Vegetative growth", "Flowering", "Fruit/grain development"]

  recommendations.push(`\n🎯 Critical irrigation stages for ${cropType}:`)
  stages.forEach((stage) => {
    recommendations.push(`• ${stage}: Maintain optimal moisture`)
  })

  recommendations.push("\n📏 Irrigation Guidelines:")
  recommendations.push("• Check soil moisture at 6-inch depth")
  recommendations.push("• Water deeply but less frequently")
  recommendations.push("• Avoid overhead irrigation during flowering")

  return recommendations
}

function getOrganicMethods(cropType: string, cropHealth: string, yieldPrediction: any) {
  const recommendations: string[] = []

  // Universal organic practices
  recommendations.push("🌱 Organic Soil Health:")
  recommendations.push("• Apply compost or well-rotted manure (5-10 tons/hectare)")
  recommendations.push("• Use cover crops during off-season")
  recommendations.push("• Practice crop rotation to maintain soil fertility")
  recommendations.push("• Apply organic mulch to conserve moisture and suppress weeds")

  // Crop-specific organic methods
  const organicGuide: Record<string, string[]> = {
    rice: [
      "• System of Rice Intensification (SRI) for higher yields with less water",
      "• Azolla cultivation as biofertilizer and livestock feed",
      "• Duck integration for weed and pest control",
      "• Rice straw incorporation for soil organic matter",
    ],
    wheat: [
      "• Green manuring with legumes before wheat sowing",
      "• Vermicompost application for slow-release nutrients",
      "• Intercropping with mustard for pest management",
      "• Wheat straw mulching for moisture conservation",
    ],
    corn: [
      "• Three sisters planting (corn, beans, squash)",
      "• Compost tea foliar application",
      "• Beneficial microorganism inoculation",
      "• Companion planting with legumes for nitrogen fixation",
    ],
    cotton: [
      "• Trap cropping with okra or sunflower",
      "• Neem cake application as soil amendment",
      "• Intercropping with marigold for nematode control",
      "• Organic matter enhancement with cotton gin trash",
    ],
    tomato: [
      "• Companion planting with basil and marigold",
      "• Calcium-rich organic amendments (bone meal, eggshells)",
      "• Beneficial bacteria and mycorrhizal inoculation",
      "• Organic mulching with straw or grass clippings",
    ],
  }

  const specificMethods = organicGuide[cropType] || [
    "• Organic matter incorporation",
    "• Beneficial microorganism application",
    "• Natural pest deterrent plants",
    "• Organic mulching practices",
  ]

  recommendations.push("\n🌿 Crop-Specific Organic Methods:")
  recommendations.push(...specificMethods)

  // Yield-based organic intensification
  if (yieldPrediction.level === "Low") {
    recommendations.push("\n🚨 Intensive Organic Recovery:")
    recommendations.push("• Liquid organic fertilizer application weekly")
    recommendations.push("• Foliar spray with seaweed extract")
    recommendations.push("• Beneficial microbe soil drench")
    recommendations.push("• Organic growth stimulants (humic acid, amino acids)")
  } else if (yieldPrediction.level === "Medium") {
    recommendations.push("\n📈 Organic Yield Enhancement:")
    recommendations.push("• Bi-weekly compost tea application")
    recommendations.push("• Organic growth promoters")
    recommendations.push("• Beneficial insect habitat creation")
  }

  // Health-based organic treatments
  if (cropHealth === "poor" || cropHealth === "fair") {
    recommendations.push("\n🏥 Organic Health Recovery:")
    recommendations.push("• Organic silicon supplements for plant strength")
    recommendations.push("• Probiotic soil treatments")
    recommendations.push("• Natural plant growth regulators")
    recommendations.push("• Organic stress relief formulations")
  }

  recommendations.push("\n⏱️ Application Schedule:")
  recommendations.push("• Compost: Apply 2-3 weeks before planting")
  recommendations.push("• Liquid fertilizers: Every 2-3 weeks during growing season")
  recommendations.push("• Foliar sprays: Early morning application preferred")
  recommendations.push("• Mulching: Apply after soil warming in spring")

  return recommendations
}
