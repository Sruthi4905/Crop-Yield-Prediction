"use client"

import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void
  selectedLanguage: string
}

export function LanguageSelector({ onLanguageChange, selectedLanguage }: LanguageSelectorProps) {
  const { i18n } = useTranslation()

  const languages = [
    { value: "en", label: "English", native: "English" },
    { value: "hi", label: "Hindi", native: "हिंदी" },
    { value: "te", label: "Telugu", native: "తెలుగు" },
    { value: "ta", label: "Tamil", native: "தமிழ்" },
    { value: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
    { value: "ml", label: "Malayalam", native: "മലയാളം" },
    { value: "gu", label: "Gujarati", native: "ગુજરાતી" },
    { value: "mr", label: "Marathi", native: "मराठी" },
    { value: "bn", label: "Bengali", native: "বাংলা" },
    { value: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  ]

  const handleLanguageChange = (language: string) => {
    try {
      i18n.changeLanguage(language)
      localStorage.setItem("lang", language)
      sessionStorage.setItem("language", language)
      onLanguageChange(language)
    } catch (error) {
      console.error("Error changing language:", error)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="language" className="text-lg">
        Select Your Language / भाषा चुनें / మీ భాషను ఎంచుకోండి
      </Label>
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="text-lg h-12">
          <SelectValue placeholder="Choose your preferred language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value} className="text-base">
              {lang.native} ({lang.label})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
