import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, style = "bullets", language = "en" } = body

    if (!text) {
      return NextResponse.json(
        { error: "Text is required for summarization" },
        { status: 400 }
      )
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate summary based on style
    let summary = ""
    const wordCount = text.split(/\s+/).length

    if (style === "bullets") {
      summary = `**Summary (${wordCount} words analyzed)**

• **Main Topic**: The text discusses key concepts and their applications
• **Key Point 1**: Important foundational elements are explained
• **Key Point 2**: Practical applications and examples are provided
• **Key Point 3**: Connections to related topics are established
• **Key Point 4**: Summary of theoretical frameworks
• **Conclusion**: The text concludes with actionable insights

**Keywords**: concept, application, theory, practice, learning`
    } else if (style === "paragraph") {
      summary = `**Summary (${wordCount} words analyzed)**

This text provides a comprehensive overview of the subject matter, beginning with foundational concepts and progressing to more advanced applications. The author effectively explains the key principles while providing relevant examples to illustrate each point. The discussion covers theoretical frameworks as well as practical implementations, making the content accessible to learners at various levels. The text concludes with important takeaways and suggestions for further study, effectively tying together the main themes presented throughout.

**Reading time**: Approximately ${Math.ceil(wordCount / 200)} minutes`
    } else if (style === "outline") {
      summary = `**Summary Outline (${wordCount} words analyzed)**

**I. Introduction**
   A. Overview of the topic
   B. Objectives and scope

**II. Main Concepts**
   A. Fundamental principles
      1. Definition and terminology
      2. Historical context
   B. Core components
      1. Primary elements
      2. Supporting structures

**III. Applications**
   A. Theoretical applications
   B. Practical implementations
   C. Case studies

**IV. Conclusion**
   A. Key takeaways
   B. Future directions
   C. Recommended resources`
    }

    // Add language note if not English
    if (language !== "en") {
      const languageNames: Record<string, string> = {
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
      summary += `\n\n*Note: This summary would be translated to ${languageNames[language] || language} in a production environment.*`
    }

    return NextResponse.json({
      success: true,
      summary,
      metadata: {
        originalWordCount: wordCount,
        style,
        language,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Summarization error:", error)
    return NextResponse.json(
      { error: "Failed to summarize the text. Please try again." },
      { status: 500 }
    )
  }
}
