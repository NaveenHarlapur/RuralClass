"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  Send,
  User,
  Sparkles,
  BookOpen,
  Loader2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  subject?: string;
  isLoading?: boolean;
  feedback?: "positive" | "negative";
}

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "Hindi",
  "Biology",
  "Economics",
  "General",
];

const sampleQuestions = [
  "Explain the concept of derivatives in calculus",
  "What is Newton's third law of motion?",
  "How does photosynthesis work?",
  "Explain object-oriented programming",
  "What are the main causes of inflation?",
];

export function DoubtChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI learning assistant. I can help you understand concepts, solve problems, and clarify doubts in any subject. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("General");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = async (question: string): Promise<string> => {
    // Simulated AI response - In production, this would call your AI API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responses: Record<string, string> = {
      derivatives:
        "**Derivatives in Calculus**\n\nA derivative represents the rate of change of a function. If you have a function f(x), its derivative f'(x) tells you how fast f(x) is changing at any point x.\n\n**Key Concepts:**\n1. **Definition:** f'(x) = lim(h→0) [f(x+h) - f(x)] / h\n2. **Geometrically:** It's the slope of the tangent line at a point\n3. **Physically:** It represents velocity if f(x) is position\n\n**Example:** If f(x) = x², then f'(x) = 2x\n\nWould you like me to explain any specific aspect in more detail?",
      newton:
        "**Newton's Third Law of Motion**\n\nFor every action, there is an equal and opposite reaction.\n\n**Explanation:**\n- When object A exerts a force on object B, object B simultaneously exerts a force equal in magnitude but opposite in direction on object A\n- These forces act on different objects, so they don't cancel out\n\n**Examples:**\n1. Walking: You push the ground backward, ground pushes you forward\n2. Rocket propulsion: Exhaust gases push down, rocket moves up\n3. Swimming: You push water backward, water pushes you forward\n\nWould you like to see some practice problems?",
      photosynthesis:
        "**Photosynthesis**\n\nPhotosynthesis is the process by which plants convert light energy into chemical energy.\n\n**Equation:**\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n**Two Main Stages:**\n1. **Light-dependent reactions** (in thylakoids)\n   - Capture light energy\n   - Split water molecules\n   - Produce ATP and NADPH\n\n2. **Calvin Cycle** (in stroma)\n   - Use ATP and NADPH\n   - Fix CO₂ into glucose\n\n**Key Factors:**\n- Light intensity\n- CO₂ concentration\n- Temperature\n\nShall I explain any part in more detail?",
      default:
        "That's a great question! Let me help you understand this concept.\n\nBased on your question, here are the key points to consider:\n\n1. **Foundation:** Start by understanding the basic principles\n2. **Application:** See how it applies in real-world scenarios\n3. **Practice:** Work through examples to solidify understanding\n\nWould you like me to:\n- Provide more detailed explanation?\n- Give you practice problems?\n- Explain a related concept?\n\nFeel free to ask follow-up questions!",
    };

    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes("derivative")) return responses.derivatives;
    if (lowerQuestion.includes("newton") || lowerQuestion.includes("third law"))
      return responses.newton;
    if (lowerQuestion.includes("photosynthesis")) return responses.photosynthesis;
    return responses.default;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      subject: selectedSubject,
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateResponse(userMessage.content);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: response, isLoading: false }
            : msg
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: "Sorry, I encountered an error. Please try again.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg))
    );
  };

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Chat cleared! How can I help you with your studies today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader className="flex-shrink-0 border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Doubt Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ask any academic question
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[140px]">
                <BookOpen className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleClearChat}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
        {/* Sample Questions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try asking:</span>
            {sampleQuestions.slice(0, 3).map((question, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => handleSampleQuestion(question)}
              >
                {question.length > 30 ? question.substring(0, 30) + "..." : question}
              </Badge>
            ))}
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback
                    className={
                      message.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary"
                    }
                  >
                    {message.role === "assistant" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex max-w-[80%] flex-col gap-1 ${
                    message.role === "user" ? "items-end" : ""
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    )}
                  </div>
                  {message.role === "assistant" && !message.isLoading && message.id !== "welcome" && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleCopy(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${
                          message.feedback === "positive" ? "text-green-500" : ""
                        }`}
                        onClick={() => handleFeedback(message.id, "positive")}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 ${
                          message.feedback === "negative" ? "text-destructive" : ""
                        }`}
                        onClick={() => handleFeedback(message.id, "negative")}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
