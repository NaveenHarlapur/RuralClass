import { NextRequest, NextResponse } from "next/server"

const languageNames: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  or: "Odia",
  as: "Assamese",
  ur: "Urdu",
}

// Sample translations for demo
const sampleTranslations: Record<string, Record<string, string>> = {
  hi: {
    hello: "नमस्ते",
    "welcome to our platform": "हमारे प्लेटफॉर्म में आपका स्वागत है",
    learning: "सीखना",
    education: "शिक्षा",
  },
  ta: {
    hello: "வணக்கம்",
    "welcome to our platform": "எங்கள் தளத்திற்கு வரவேற்கிறோம்",
    learning: "கற்றல்",
    education: "கல்வி",
  },
  te: {
    hello: "నమస్కారం",
    "welcome to our platform": "మా ప్లాట్‌ఫారమ్‌కు స్వాగతం",
    learning: "నేర్చుకోవడం",
    education: "విద్య",
  },
  bn: {
    hello: "নমস্কার",
    "welcome to our platform": "আমাদের প্ল্যাটফর্মে স্বাগতম",
    learning: "শেখা",
    education: "শিক্ষা",
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, sourceLanguage = "en", targetLanguage } = body

    if (!text) {
      return NextResponse.json(
        { error: "Text is required for translation" },
        { status: 400 }
      )
    }

    if (!targetLanguage) {
      return NextResponse.json(
        { error: "Target language is required" },
        { status: 400 }
      )
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate mock translation
    // In production, this would use a real translation API
    let translatedText = text

    if (targetLanguage !== sourceLanguage) {
      // For demo, add a note about translation
      const sourceLang = languageNames[sourceLanguage] || sourceLanguage
      const targetLang = languageNames[targetLanguage] || targetLanguage
      
      translatedText = `[Translated from ${sourceLang} to ${targetLang}]

${text}

---
Note: In a production environment, this would show the actual translation using a professional translation API (like Google Translate, Azure Translator, or a specialized educational translation service).

The translation would preserve:
• Technical terminology
• Educational context
• Formatting and structure
• Regional language nuances`
    }

    return NextResponse.json({
      success: true,
      translation: {
        originalText: text,
        translatedText,
        sourceLanguage,
        targetLanguage,
        sourceLangName: languageNames[sourceLanguage] || sourceLanguage,
        targetLangName: languageNames[targetLanguage] || targetLanguage,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json(
      { error: "Failed to translate the text. Please try again." },
      { status: 500 }
    )
  }
}
