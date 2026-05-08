"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoubtChatbot } from "@/components/ai/doubt-chatbot";
import { NotesSummarizer } from "@/components/ai/notes-summarizer";
import { LanguageTranslator } from "@/components/ai/language-translator";
import { Bot, FileText, Languages, Sparkles } from "lucide-react";

export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Learning Tools</h1>
        <p className="text-muted-foreground">
          Powered by AI to enhance your learning experience
        </p>
      </div>

      {/* Feature Badges */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          AI-Powered
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400">
          <Bot className="h-4 w-4" />
          24/7 Available
        </div>
        <div className="flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
          <Languages className="h-4 w-4" />
          Multi-Language
        </div>
      </div>

      <Tabs defaultValue="doubt-assistant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
          <TabsTrigger value="doubt-assistant" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Doubt Assistant</span>
            <span className="sm:hidden">Ask</span>
          </TabsTrigger>
          <TabsTrigger value="summarizer" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Summarizer</span>
            <span className="sm:hidden">Sum</span>
          </TabsTrigger>
          <TabsTrigger value="translator" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Translator</span>
            <span className="sm:hidden">Trans</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doubt-assistant">
          <DoubtChatbot />
        </TabsContent>

        <TabsContent value="summarizer">
          <NotesSummarizer />
        </TabsContent>

        <TabsContent value="translator">
          <LanguageTranslator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
