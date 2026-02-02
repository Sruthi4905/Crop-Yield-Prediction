// Enhanced image analysis service for crop health assessment
import { verifyCropImage } from "./image-verification"

export async function analyzeCropImages(images: File[], cropType: string) {
  // Use the enhanced verification system
  const verificationResult = await verifyCropImage(images, cropType)

  // If crop verification fails, return verification-focused results
  if (!verificationResult.isCorrectCrop) {
    return {
      healthStatus: "verification_failed",
      confidence: verificationResult.confidence,
      healthScore: 0,
      detectedIssues: verificationResult.detectedIssues,
      growthStage: "unknown",
      analysisDetails: verificationResult.analysisDetails,
      recommendations: generateVerificationFailedRecommendations(cropType, verificationResult),
      verificationResult: verificationResult,
      cropMismatch: true,
    }
  }

  // If verification passes, continue with health analysis
  return {
    healthStatus: verificationResult.health,
    confidence: verificationResult.confidence,
    healthScore: verificationResult.analysisDetails[0]?.healthScore || 0.7,
    detectedIssues: verificationResult.detectedIssues,
    growthStage: verificationResult.analysisDetails[0]?.visualFeatures?.growthStage || "developing",
    analysisDetails: verificationResult.analysisDetails,
    recommendations: generateImageBasedRecommendations(
      verificationResult.health,
      verificationResult.detectedIssues,
      cropType,
    ),
    verificationResult: verificationResult,
    cropMismatch: false,
  }
}

// Simulate individual image analysis
async function analyzeIndividualImage(image: File, cropType: string, seed: string) {
  // Generate deterministic "random" numbers based on seed
  const generateDeterministicRandom = (min: number, max: number) => {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i)
      hash |= 0
    }
    const normalizedHash = Math.abs(hash) / 2147483647
    return min + normalizedHash * (max - min)
  }

  // Simulate image analysis results
  const healthScore = generateDeterministicRandom(0.3, 0.95)
  const confidence = generateDeterministicRandom(0.75, 0.95)

  // Simulate visual feature detection
  const leafColor = healthScore > 0.7 ? "green" : healthScore > 0.4 ? "yellow-green" : "brown"
  const pestDamage = healthScore < 0.4 && generateDeterministicRandom(0, 1) > 0.6
  const diseaseSymptoms = healthScore < 0.5 && generateDeterministicRandom(0, 1) > 0.7
  const nutrientDeficiency = healthScore < 0.6 && generateDeterministicRandom(0, 1) > 0.5

  // Growth stage detection
  const growthStages = ["seedling", "vegetative", "flowering", "fruiting", "mature"]
  const stageIndex = Math.floor(generateDeterministicRandom(0, growthStages.length))
  const growthStage = growthStages[stageIndex]

  return {
    healthScore,
    confidence,
    leafColor,
    pestDamage,
    diseaseSymptoms,
    nutrientDeficiency,
    growthStage,
    visualFeatures: {
      leafDensity: healthScore > 0.6 ? "dense" : "sparse",
      plantHeight: growthStage === "mature" ? "tall" : "medium",
      fruitPresence: growthStage === "fruiting" || growthStage === "mature",
    },
  }
}

function getMostCommon(arr: string[]): string {
  const counts = arr.reduce(
    (acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(counts).reduce((a, b) => (counts[a[0]] > counts[b[0]] ? a : b))[0]
}

function generateImageBasedRecommendations(healthStatus: string, issues: string[], cropType: string): string[] {
  const recommendations = []

  if (healthStatus === "excellent") {
    recommendations.push("🎉 Your crops look fantastic! Continue your current care routine.")
    recommendations.push("📸 Consider taking photos weekly to monitor any changes.")
  } else if (healthStatus === "good") {
    recommendations.push("👍 Good crop health detected. Minor improvements may boost yield.")
    recommendations.push("🔍 Monitor closely for any developing issues.")
  } else if (healthStatus === "fair") {
    recommendations.push("⚠️ Some concerns detected. Follow specific recommendations below.")
    recommendations.push("📅 Increase monitoring frequency to twice weekly.")
  } else {
    recommendations.push("🚨 Immediate attention required! Implement corrective measures urgently.")
    recommendations.push("👨‍🌾 Consider consulting with a local agricultural expert.")
  }

  // Issue-specific recommendations
  if (issues.includes("Disease symptoms detected in multiple images")) {
    recommendations.push("🦠 Apply appropriate fungicide or bactericide based on symptoms.")
    recommendations.push("🌬️ Improve air circulation and reduce humidity around plants.")
  }

  if (issues.includes("Pest damage visible in several areas")) {
    recommendations.push("🐛 Implement integrated pest management strategies immediately.")
    recommendations.push("🔍 Identify specific pests and apply targeted treatments.")
  }

  if (issues.includes("Nutrient deficiency signs observed")) {
    recommendations.push("🌱 Conduct soil test and apply appropriate fertilizers.")
    recommendations.push("💧 Consider foliar feeding for quick nutrient uptake.")
  }

  return recommendations
}

function generateVerificationFailedRecommendations(expectedCrop: string, verificationResult: any): string[] {
  const recommendations = []

  recommendations.push("❌ Crop verification failed! The uploaded images don't match the selected crop type.")

  if (verificationResult.verificationSummary.wrongMatches > 0) {
    recommendations.push(
      `📸 ${verificationResult.verificationSummary.wrongMatches} out of ${verificationResult.verificationSummary.totalImages} images appear to be different crops.`,
    )
  }

  if (verificationResult.detectedCrop && verificationResult.detectedCrop !== expectedCrop) {
    recommendations.push(`🔍 Images appear to show ${verificationResult.detectedCrop} instead of ${expectedCrop}.`)
  }

  recommendations.push("📋 Please ensure you:")
  recommendations.push("• Upload clear images of your actual crop")
  recommendations.push("• Select the correct crop type from the dropdown")
  recommendations.push("• Take photos showing distinctive crop features")
  recommendations.push("• Avoid images of other plants or crops")

  recommendations.push("💡 Try uploading new images or changing your crop selection to match the uploaded photos.")

  return recommendations
}

// Function to get crop photography tips
export function getCropPhotographyTips(cropType: string): string[] {
  const generalTips = [
    "Take photos in good natural light (avoid flash)",
    "Include both close-up and wide shots of the plant",
    "Show distinctive features that identify your crop",
    "Avoid blurry, dark, or heavily filtered images",
    "Take photos from multiple angles",
    "Ensure images clearly show the selected crop type",
  ]

  const cropSpecificTips: Record<string, string[]> = {
    rice: [
      "Show the characteristic long, narrow leaves",
      "Include rice panicles or grain heads if available",
      "Capture the tillering (multiple shoots) pattern",
      "Show flooded field environment if applicable",
    ],
    wheat: [
      "Photograph the distinctive wheat ears/heads",
      "Show the narrow, elongated leaves",
      "Capture golden color if crop is mature",
      "Include full plant structure from base to top",
    ],
    corn: [
      "Show the broad, long leaves characteristic of corn",
      "Include corn ears or tassels if visible",
      "Capture the thick, tall stalks",
      "Show the distinctive corn plant structure",
    ],
    cotton: [
      "Photograph cotton bolls (white fluffy cotton)",
      "Show the broad, lobed leaves",
      "Include cotton flowers (white or yellow) if present",
      "Capture the bushy, branching plant structure",
    ],
    tomato: [
      "Show tomato fruits in various ripening stages",
      "Capture the compound, serrated leaves",
      "Include yellow tomato flowers if blooming",
      "Show the vine-like growth pattern",
    ],
    potato: [
      "Photograph the compound leaves with multiple leaflets",
      "Show the bushy, mounded growth pattern",
      "Include white or purple flowers if present",
      "Avoid showing just soil or tubers",
    ],
    onion: [
      "Show the long, tubular green leaves",
      "Capture the grass-like, upright growth",
      "Include the bulb base if visible",
      "Show the distinctive blue-green leaf color",
    ],
    sugarcane: [
      "Photograph the tall, thick jointed stalks",
      "Show the narrow leaves at stalk nodes",
      "Capture the impressive height of the plant",
      "Include multiple stalks to show clustering",
    ],
  }

  return [...generalTips, ...(cropSpecificTips[cropType] || [])]
}
