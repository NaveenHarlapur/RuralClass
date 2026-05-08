"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Download,
  FileText,
  Video,
  Music,
  FileArchive,
  Search,
  ExternalLink,
  WifiOff,
  Loader2,
} from "lucide-react"

interface Material {
  id: string
  title: string
  description: string | null
  subject: string
  teacherName: string
  uploadDate: string
  type: string
  size: string
  url: string | null
  offline: boolean
}

function FileIcon({ type }: { type: string }) {
  const t = type.toLowerCase()
  if (['mp4', 'webm'].includes(t)) return <Video className="h-6 w-6 text-primary" />
  if (['mp3'].includes(t)) return <Music className="h-6 w-6 text-primary" />
  if (['zip'].includes(t)) return <FileArchive className="h-6 w-6 text-primary" />
  return <FileText className="h-6 w-6 text-primary" />
}

export default function DownloadsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/student/materials')
      .then(r => r.ok ? r.json() : [])
      .then((data: Material[]) => {
        if (Array.isArray(data)) setMaterials(data)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return materials
    return materials.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.teacherName.toLowerCase().includes(q)
    )
  }, [materials, search])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Downloads</h1>
          <p className="text-muted-foreground">
            Download study materials to access them offline
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit gap-1.5 border-primary/30 bg-primary/10 px-3 py-1 text-primary"
        >
          <WifiOff className="h-3.5 w-3.5" />
          Offline Mode Ready
        </Badge>
      </div>

      {/* Search */}
      {materials.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Files list */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Download className="mb-3 h-12 w-12 text-muted-foreground/50" />
            {materials.length === 0 ? (
              <>
                <p className="text-lg font-medium text-foreground">No materials available</p>
                <p className="text-sm text-muted-foreground">
                  Your teachers haven&apos;t uploaded any files yet.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No results match your search.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(item => (
            <Card key={item.id} className="border-border/50">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: icon + info */}
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileIcon type={item.type} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.subject} &bull; {item.size} &bull; by {item.teacherName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right: badges + actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="secondary" className="uppercase text-[10px]">
                    {item.type}
                  </Badge>
                  {item.offline && (
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      <WifiOff className="h-3 w-3" />
                      Offline
                    </Badge>
                  )}
                  {item.url ? (
                    <>
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={item.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" title="Open">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Unavailable
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
