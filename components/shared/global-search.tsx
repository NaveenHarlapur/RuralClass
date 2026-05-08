"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  ClipboardList,
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  Bot,
  Download,
  Bell,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "note" | "assignment" | "discussion" | "course" | "page";
  href: string;
  badge?: string;
}

const quickLinks = [
  {
    title: "Dashboard",
    href: "/dashboard/student",
    icon: BookOpen,
    description: "Go to your dashboard",
  },
  {
    title: "My Notes",
    href: "/dashboard/student/notes",
    icon: FileText,
    description: "View all notes",
  },
  {
    title: "Assignments",
    href: "/dashboard/student/assignments",
    icon: ClipboardList,
    description: "View assignments",
  },
  {
    title: "AI Assistant",
    href: "/dashboard/student/ai-tools",
    icon: Bot,
    description: "Ask doubts to AI",
  },
  {
    title: "Discussions",
    href: "/dashboard/student/discussions",
    icon: MessageSquare,
    description: "Join discussions",
  },
  {
    title: "Downloads",
    href: "/dashboard/student/downloads",
    icon: Download,
    description: "Offline content",
  },
  {
    title: "Progress",
    href: "/dashboard/student/progress",
    icon: BarChart3,
    description: "Track your progress",
  },
  {
    title: "Announcements",
    href: "/dashboard/student/announcements",
    icon: Bell,
    description: "View announcements",
  },
  {
    title: "Settings",
    href: "/dashboard/student/settings",
    icon: Settings,
    description: "Account settings",
  },
];

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Introduction to Data Structures",
    description: "Computer Science - Semester 3",
    type: "note",
    href: "/dashboard/student/notes/1",
    badge: "PDF",
  },
  {
    id: "2",
    title: "Assignment 3: Linked Lists",
    description: "Due: Dec 15, 2024",
    type: "assignment",
    href: "/dashboard/student/assignments/2",
    badge: "Pending",
  },
  {
    id: "3",
    title: "Help with recursion concept",
    description: "15 replies - Last active 2 hours ago",
    type: "discussion",
    href: "/dashboard/student/discussions/3",
  },
  {
    id: "4",
    title: "Physics - Mechanics",
    description: "Semester 2 Course",
    type: "course",
    href: "/dashboard/student/courses/4",
  },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Search handler
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length > 1) {
      // Filter mock results - in production, this would be an API call
      const filtered = mockSearchResults.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "note":
        return <FileText className="h-4 w-4" />;
      case "assignment":
        return <ClipboardList className="h-4 w-4" />;
      case "discussion":
        return <MessageSquare className="h-4 w-4" />;
      case "course":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search notes, assignments...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search notes, assignments, discussions..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center py-6">
              <Search className="mb-2 h-8 w-8 text-muted-foreground" />
              <p>No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-muted-foreground">
                Try searching for something else
              </p>
            </div>
          </CommandEmpty>

          {/* Search Results */}
          {results.length > 0 && (
            <CommandGroup heading="Search Results">
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result.href)}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium">{result.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {result.description}
                    </p>
                  </div>
                  {result.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {result.badge}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Quick Links */}
          {query.length === 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Quick Links">
                {quickLinks.map((link) => (
                  <CommandItem
                    key={link.href}
                    onSelect={() => handleSelect(link.href)}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <link.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{link.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
