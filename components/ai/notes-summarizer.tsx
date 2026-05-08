"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Download,
  ListOrdered,
  AlignLeft,
  BookOpen,
  Languages,
} from "lucide-react";

type SummaryStyle = "bullet" | "paragraph" | "outline";
type SummaryLength = "short" | "medium" | "detailed";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "bn", name: "Bengali" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
];

export function NotesSummarizer() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [style, setStyle] = useState<SummaryStyle>("bullet");
  const [length, setLength] = useState<SummaryLength>("medium");
  const [language, setLanguage] = useState("en");
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setProgress(0);
    setSummary("");
    setKeyPoints([]);

    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    // Generate mock summary based on style
    const mockSummary =
      style === "bullet"
        ? `• The content discusses fundamental concepts and their applications
• Key principles are outlined with practical examples
• Important terminology is defined and explained
• Connections between different concepts are highlighted
• Real-world applications demonstrate practical relevance
• Summary includes actionable takeaways for study`
        : style === "outline"
        ? `I. Introduction
   A. Overview of main topic
   B. Scope and objectives

II. Core Concepts
   A. Fundamental principles
   B. Key definitions
   C. Important relationships

III. Applications
   A. Practical examples
   B. Real-world scenarios

IV. Conclusion
   A. Key takeaways
   B. Further study recommendations`
        : `This content provides a comprehensive overview of the subject matter, beginning with foundational concepts and progressing to more advanced applications. The material emphasizes key principles and their practical relevance, supported by examples and clear explanations. Important terminology is carefully defined, and connections between different topics are highlighted to facilitate deeper understanding. The content concludes with actionable insights and recommendations for further study.`;

    const mockKeyPoints = [
      "Main concept definition and overview",
      "Key principles and their relationships",
      "Practical applications and examples",
      "Important terminology to remember",
      "Connections to related topics",
      "Study recommendations and next steps",
    ];

    setSummary(mockSummary);
    setKeyPoints(mockKeyPoints);
    setIsProcessing(false);
  };

  const handleCopy = async () => {
    const fullContent = `Summary:\n${summary}\n\nKey Points:\n${keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`;
    await navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullContent = `Summary:\n${summary}\n\nKey Points:\n${keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`;
    const blob = new Blob([fullContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Input Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your notes or text content here to generate a summary..."
            className="min-h-[300px] resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[140px]">
              <label className="mb-2 block text-sm font-medium">Style</label>
              <Select value={style} onValueChange={(v) => setStyle(v as SummaryStyle)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet">
                    <div className="flex items-center gap-2">
                      <ListOrdered className="h-4 w-4" />
                      Bullet Points
                    </div>
                  </SelectItem>
                  <SelectItem value="paragraph">
                    <div className="flex items-center gap-2">
                      <AlignLeft className="h-4 w-4" />
                      Paragraph
                    </div>
                  </SelectItem>
                  <SelectItem value="outline">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Outline
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="mb-2 block text-sm font-medium">Length</label>
              <Select value={length} onValueChange={(v) => setLength(v as SummaryLength)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="mb-2 block text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <Languages className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={generateSummary}
            disabled={!inputText.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-center text-sm text-muted-foreground">
                Analyzing content... {progress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
            {summary && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {summary ? (
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="keypoints">Key Points</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <ScrollArea className="h-[350px] rounded-lg border bg-muted/30 p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {summary}
                  </pre>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="keypoints">
                <ScrollArea className="h-[350px]">
                  <div className="space-y-3">
                    {keyPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                      >
                        <Badge variant="secondary" className="mt-0.5">
                          {index + 1}
                        </Badge>
                        <p className="text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center text-center text-muted-foreground">
              <Sparkles className="mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium">No summary yet</p>
              <p className="text-sm">
                Paste your notes and click &quot;Generate Summary&quot; to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
