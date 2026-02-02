"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, CheckCircle, AlertCircle, Camera, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { analyzeCropImages, getCropPhotographyTips } from "@/lib/image-analysis"

interface ImageUploadProps {
  cropType: string
  onAnalysisComplete: (healthStatus: string, analysisResult: any) => void
}

export function ImageUpload({ cropType, onAnalysisComplete }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [analysisStatus, setAnalysisStatus] = useState<
    "pending" | "analyzing" | "complete" | "error" | "verification_failed"
  >("pending")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(`${file.name} is too large. Please use images under 10MB.`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Limit to 5 images
    const selectedFiles = validFiles.slice(0, 5)
    setImages(selectedFiles)

    // Create previews
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews(newPreviews)

    // Reset analysis status
    setAnalysisStatus("pending")
    setAnalysisResult(null)
  }

  const analyzeImages = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image")
      return
    }

    setAnalysisStatus("analyzing")

    try {
      const result = await analyzeCropImages(images, cropType)
      setAnalysisResult(result)

      if (result.cropMismatch) {
        setAnalysisStatus("verification_failed")
        onAnalysisComplete("verification_failed", result)
      } else {
        setAnalysisStatus("complete")
        onAnalysisComplete(result.healthStatus, result)
      }
    } catch (error) {
      console.error("Analysis error:", error)
      setAnalysisStatus("error")
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)

    setImages(newImages)
    setPreviews(newPreviews)

    if (newImages.length === 0) {
      setAnalysisStatus("pending")
      setAnalysisResult(null)
    }
  }

  const getStatusMessage = () => {
    switch (analysisStatus) {
      case "pending":
        return `Upload 1-5 clear images of your ${cropType} crop for AI analysis`
      case "analyzing":
        return "🔍 Analyzing your crop images and verifying crop type..."
      case "complete":
        return `✅ Analysis complete! Crop verified: ${analysisResult?.healthStatus} (${Math.round(analysisResult?.confidence * 100)}% confidence)`
      case "verification_failed":
        return `❌ Crop verification failed! Images don't match selected ${cropType} crop`
      case "error":
        return "❌ Analysis failed. Please try again with different images."
      default:
        return ""
    }
  }

  const getStatusColor = () => {
    switch (analysisStatus) {
      case "complete":
        return "border-green-500 bg-green-50 text-green-700"
      case "verification_failed":
        return "border-orange-500 bg-orange-50 text-orange-700"
      case "error":
        return "border-red-500 bg-red-50 text-red-700"
      case "analyzing":
        return "border-blue-500 bg-blue-50 text-blue-700"
      default:
        return "border-gray-300 bg-gray-50 text-gray-700"
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

  const photographyTips = getCropPhotographyTips(cropType)

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Upload Images of Your {cropType} Crop</Label>
        <p className="text-sm text-gray-600 mt-1">
          Our AI will verify the crop type and analyze health to provide personalized recommendations
        </p>
      </div>

      {/* Enhanced Photography Tips with Verification Focus */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>📸 Important: Upload images that clearly show {cropType} features</strong>
          <ul className="mt-2 space-y-1">
            {photographyTips.slice(0, 4).map((tip, index) => (
              <li key={index} className="text-sm">
                • {tip}
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {images.length === 0 ? (
          <div className="space-y-4">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">Click to upload crop images</p>
              <p className="text-sm text-gray-500">Upload 1-5 clear photos of your {cropType} crop</p>
              <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, WebP (Max 10MB each)</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="text-lg h-12"
            >
              <Upload className="mr-2 h-5 w-5" />
              Choose Images
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {previews.map((preview, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-2">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Crop ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {images.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-base"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add More Images ({images.length}/5)
                </Button>
              )}

              <Button
                type="button"
                onClick={analyzeImages}
                disabled={analysisStatus === "analyzing"}
                className="bg-green-600 hover:bg-green-700 text-base"
              >
                {analysisStatus === "analyzing" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Images...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Analyze Crop Health
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Analysis Status with Verification Details */}
      <div className={`p-4 rounded-lg border-2 ${getStatusColor()}`}>
        <div className="flex items-center space-x-2">
          {analysisStatus === "analyzing" && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
          {analysisStatus === "complete" && <CheckCircle className="h-5 w-5 text-green-600" />}
          {analysisStatus === "verification_failed" && <AlertCircle className="h-5 w-5 text-orange-600" />}
          {analysisStatus === "error" && <AlertCircle className="h-5 w-5 text-red-600" />}
          <p className="text-base font-medium">{getStatusMessage()}</p>
        </div>

        {analysisResult && (analysisStatus === "complete" || analysisStatus === "verification_failed") && (
          <div className="mt-4 space-y-3">
            {/* Verification Results */}
            {analysisResult.verificationResult && (
              <div className="bg-blue-50 p-3 rounded border">
                <p className="font-medium text-sm text-blue-800 mb-1">Crop Verification Results:</p>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Total Images: {analysisResult.verificationResult.verificationSummary?.totalImages}</p>
                  <p>• Correct Matches: {analysisResult.verificationResult.verificationSummary?.correctMatches}</p>
                  <p>• Match Percentage: {Math.round(analysisResult.verificationResult.matchPercentage || 0)}%</p>
                  {analysisResult.verificationResult.detectedCrop !== cropType && (
                    <p className="text-orange-700">• Detected Crop: {analysisResult.verificationResult.detectedCrop}</p>
                  )}
                </div>
              </div>
            )}

            {/* Health Results (only if verification passed) */}
            {analysisStatus === "complete" && (
              <div className="flex flex-wrap gap-2">
                <Badge className={getHealthBadgeColor(analysisResult.healthStatus)}>
                  Health: {analysisResult.healthStatus}
                </Badge>
                <Badge variant="outline">Confidence: {Math.round(analysisResult.confidence * 100)}%</Badge>
                <Badge variant="outline">Growth Stage: {analysisResult.growthStage}</Badge>
              </div>
            )}

            {/* Issues and Recommendations */}
            {analysisResult.detectedIssues.length > 0 && (
              <div
                className={`p-3 rounded border ${analysisStatus === "verification_failed" ? "bg-orange-50" : "bg-yellow-50"}`}
              >
                <p
                  className={`font-medium text-sm mb-1 ${analysisStatus === "verification_failed" ? "text-orange-800" : "text-yellow-800"}`}
                >
                  {analysisStatus === "verification_failed" ? "Verification Issues:" : "Detected Issues:"}
                </p>
                <ul
                  className={`text-sm space-y-1 ${analysisStatus === "verification_failed" ? "text-orange-700" : "text-yellow-700"}`}
                >
                  {analysisResult.detectedIssues.map((issue: string, index: number) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.recommendations.length > 0 && (
              <div className="bg-blue-50 p-3 rounded border">
                <p className="font-medium text-sm text-blue-800 mb-1">Recommendations:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  {analysisResult.recommendations.slice(0, 3).map((rec: string, index: number) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Guidelines with Crop-Specific Examples */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">📸 For Accurate {cropType} Detection:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <ul className="space-y-1">
            <li>• Show distinctive {cropType} features clearly</li>
            <li>• Include multiple angles of the same plant</li>
            <li>• Ensure good lighting and focus</li>
          </ul>
          <ul className="space-y-1">
            <li>• Avoid images of other crop types</li>
            <li>• Include leaves, stems, and fruits/grains</li>
            <li>• Take photos during daylight hours</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
