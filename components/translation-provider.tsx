"use client"

import { type ReactNode, useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "../i18n"

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    // Initialize language from localStorage or sessionStorage
    const storedLang = localStorage.getItem("lang") || sessionStorage.getItem("language")
    if (storedLang) {
      i18n.changeLanguage(storedLang)
    }
    setIsI18nInitialized(true)
  }, [])

  if (!isI18nInitialized) {
    return <div>Loading translations...</div>
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
