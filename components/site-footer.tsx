"use client"

import { useState } from "react"
import Link from "next/link"
import { Leaf } from "lucide-react"
import { useTranslation } from "react-i18next"

export function SiteFooter() {
  const { t } = useTranslation()
  const [year, setYear] = useState(new Date().getFullYear())

  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">{t("appName")}</span>
            </Link>
            <p className="text-green-100">{t("footerTagline")}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-green-200 hover:text-white">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/predict" className="text-green-200 hover:text-white">
                  {t("predictYield")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-green-200 hover:text-white">
                  {t("dashboard")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("resources")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-green-200 hover:text-white">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-200 hover:text-white">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-green-200 hover:text-white">
                  {t("help")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contact")}</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>support@farmhelper.com</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📱</span>
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>123 Farm Road, Agritown</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center">
          <p className="text-green-200">
            © {year} {t("appName")}. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}
