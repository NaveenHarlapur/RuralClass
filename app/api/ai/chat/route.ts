import { NextRequest, NextResponse } from "next/server"

// Mock AI responses for different subjects
const subjectResponses: Record<string, string[]> = {
  mathematics: [
    "Let me explain this mathematical concept step by step. First, we need to understand the underlying principles...",
    "This is a great question about mathematics! The key insight here is...",
    "In mathematics, this problem can be solved by applying the following approach...",
  ],
  physics: [
    "This physics concept relates to fundamental principles of nature. Let me break it down...",
    "Great physics question! The key formula to remember here is...",
    "In physics, we approach this by considering the forces and energy involved...",
  ],
  chemistry: [
    "In chemistry, this reaction follows specific rules. Let me explain the mechanism...",
    "This chemical concept is important because it helps us understand molecular behavior...",
    "The chemical principle here involves understanding electron configurations and bonding...",
  ],
  computer_science: [
    "This computer science concept is fundamental to programming. Here's how it works...",
    "In data structures, we optimize this by considering time and space complexity...",
    "The algorithm for this problem uses a divide-and-conquer approach...",
  ],
  general: [
    "That's an interesting question! Let me provide a comprehensive explanation...",
    "Here's a detailed answer to your question with practical examples...",
    "I'll explain this concept in simple terms so it's easy to understand...",
  ],
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, subject = "general", conversationHistory = [] } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get subject-specific responses
    const responses = subjectResponses[subject] || subjectResponses.general
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    // Generate a contextual response
    const aiResponse = `${randomResponse}

Based on your question "${message.slice(0, 50)}${message.length > 50 ? '...' : ''}", here are the key points:

1. **Understanding the Basics**: Start by reviewing the fundamental concepts related to this topic.

2. **Application**: Try to apply this knowledge to solve practice problems.

3. **Further Learning**: I recommend reviewing the course materials in the "${subject === 'general' ? 'relevant subject' : subject.replace('_', ' ')}" section.

Would you like me to:
- Explain any specific part in more detail?
- Provide practice problems?
- Suggest additional resources?

Feel free to ask follow-up questions!`

    return NextResponse.json({
      success: true,
      response: {
        id: Math.random().toString(36).substring(7),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date().toISOString(),
        subject,
      },
    })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json(
      { error: "Failed to process your question. Please try again." },
      { status: 500 }
    )
  }
}
