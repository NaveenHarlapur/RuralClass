"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Languages,
  ArrowRightLeft,
  Loader2,
  Copy,
  Check,
  Volume2,
  History,
} from "lucide-react";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
];

interface TranslationHistory {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export function LanguageTranslator() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const translate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);

    // Simulate translation API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock translation (in production, this would call a translation API)
    const mockTranslations: Record<string, Record<string, string>> = {
      hi: {
        "Hello": "नमस्ते",
        "How are you?": "आप कैसे हैं?",
        "Welcome to the classroom": "कक्षा में आपका स्वागत है",
        "Today's lesson": "आज का पाठ",
        "Please submit your assignment": "कृपया अपना असाइनमेंट जमा करें",
      },
      ta: {
        "Hello": "வணக்கம்",
        "How are you?": "நீங்கள் எப்படி இருக்கிறீர்கள்?",
        "Welcome to the classroom": "வகுப்பறைக்கு வரவேற்கிறோம்",
      },
      te: {
        "Hello": "నమస్కారం",
        "How are you?": "మీరు ఎలా ఉన్నారు?",
        "Welcome to the classroom": "తరగతి గదికి స్వాగతం",
      },
    };

    // Simple mock: if we have a translation, use it; otherwise, add a prefix
    const targetTranslations = mockTranslations[targetLang] || {};
    const translated = targetTranslations[sourceText] ||
      `[Translated to ${languages.find((l) => l.code === targetLang)?.name}]: ${sourceText}`;

    setTranslatedText(translated);

    // Add to history
    const newEntry: TranslationHistory = {
      id: Date.now().toString(),
      sourceText,
      translatedText: translated,
      sourceLang,
      targetLang,
      timestamp: new Date(),
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);

    setIsTranslating(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  const loadFromHistory = (entry: TranslationHistory) => {
    setSourceText(entry.sourceText);
    setTranslatedText(entry.translatedText);
    setSourceLang(entry.sourceLang);
    setTargetLang(entry.targetLang);
    setShowHistory(false);
  };

  const getLanguageName = (code: string) =>
    languages.find((l) => l.code === code)?.name || code;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Regional Language Translator
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language Selection */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      {lang.name}
                      <span className="text-muted-foreground">
                        ({lang.nativeName})
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={swapLanguages}>
              <ArrowRightLeft className="h-4 w-4" />
            </Button>

            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      {lang.name}
                      <span className="text-muted-foreground">
                        ({lang.nativeName})
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Translation Areas */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{getLanguageName(sourceLang)}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeak(sourceText, sourceLang)}
                  disabled={!sourceText}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Enter text to translate..."
                className="min-h-[200px] resize-none"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
              <p className="text-right text-sm text-muted-foreground">
                {sourceText.length} characters
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{getLanguageName(targetLang)}</Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeak(translatedText, targetLang)}
                    disabled={!translatedText}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!translatedText}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="Translation will appear here..."
                className="min-h-[200px] resize-none bg-muted/30"
                value={translatedText}
                readOnly
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={translate}
            disabled={!sourceText.trim() || isTranslating}
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" />
                Translate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Translation History */}
      {showHistory && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  onClick={() => loadFromHistory(entry)}
                >
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {getLanguageName(entry.sourceLang)}
                    </Badge>
                    <ArrowRightLeft className="h-3 w-3" />
                    <Badge variant="outline" className="text-xs">
                      {getLanguageName(entry.targetLang)}
                    </Badge>
                    <span className="ml-auto">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-1">{entry.sourceText}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {entry.translatedText}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
