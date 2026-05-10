"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BookOpen,
  Download,
  Search,
  FileText,
  Video,
  Music,
  FileArchive,
  ExternalLink,
  Loader2,
  Filter,
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

function MaterialIcon({ type }: { type: string }) {
  const t = type.toLowerCase()
  if (['mp4', 'webm', 'video'].includes(t)) return <Video className="h-5 w-5 text-primary" />
  if (['mp3', 'audio'].includes(t)) return <Music className="h-5 w-5 text-primary" />
  if (['zip'].includes(t)) return <FileArchive className="h-5 w-5 text-primary" />
  return <FileText className="h-5 w-5 text-primary" />
}

function typeBadgeColor(type: string) {
  const t = type.toLowerCase()
  if (['mp4', 'webm'].includes(t)) return 'bg-blue-500/10 text-blue-600'
  if (['mp3'].includes(t)) return 'bg-purple-500/10 text-purple-600'
  if (['zip'].includes(t)) return 'bg-orange-500/10 text-orange-600'
  if (t === 'pdf') return 'bg-red-500/10 text-red-600'
  return 'bg-green-500/10 text-green-600'
}

const ALL_SUBJECTS = "All Subjects"

export default function NotesPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState(ALL_SUBJECTS)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('study_materials')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.log("[Notes] Fetch error:", error)
          return
        }

        if (data) {
          const mapped: Material[] = data.map(m => ({
            id: String(m.id),
            title: m.title,
            description: m.description,
            subject: m.subject || 'General',
            teacherName: m.teacher_name || 'Teacher',
            uploadDate: m.created_at,
            type: m.file_name?.split('.').pop() || 'file',
            size: 'Unknown',
            url: m.file_url,
            offline: false
          }))
          setMaterials(mapped)
        }
      } catch (err) {
        console.log("[Notes] Error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  // Unique subjects for filter dropdown
  const subjects = useMemo(() => {
    const unique = Array.from(new Set(materials.map(m => m.subject))).sort()
    return [ALL_SUBJECTS, ...unique]
  }, [materials])

  // Filtered materials
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return materials.filter(m => {
      const matchesSearch = !q ||
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.teacherName.toLowerCase().includes(q)
      const matchesSubject = selectedSubject === ALL_SUBJECTS || m.subject === selectedSubject
      return matchesSearch && matchesSubject
    })
  }, [materials, search, selectedSubject])

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Study Notes</h1>
        <p className="text-muted-foreground">
          Access course materials and study guides uploaded by your teachers
        </p>
      </div>

      {/* Stats bar */}
      {materials.length > 0 && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>
            <span className="font-medium text-foreground">{materials.length}</span> materials available
            {filtered.length !== materials.length && (
              <> &bull; <span className="font-medium text-foreground">{filtered.length}</span> shown</>
            )}
          </span>
        </div>
      )}

      {/* Search + Filter */}
      {materials.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes, subjects, teachers…"
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-52">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {subjects.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Materials grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/50" />
                {materials.length === 0 ? (
                  <>
                    <p className="text-lg font-medium text-foreground">No study materials uploaded yet</p>
                    <p className="text-sm text-muted-foreground">
                      Your teachers haven&apos;t uploaded any materials yet. Check back soon.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium text-foreground">No results found</p>
                    <p className="text-sm text-muted-foreground">
                      Try a different search or subject filter.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filtered.map(material => (
            <Card key={material.id} className="flex flex-col border-border/50 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="line-clamp-2 text-base leading-snug" title={material.title}>
                      {material.title}
                    </CardTitle>
                    <CardDescription className="mt-1 font-medium text-primary/80">
                      {material.subject}
                    </CardDescription>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MaterialIcon type={material.type} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end gap-3">
                {/* Meta */}
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>By {material.teacherName}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] uppercase ${typeBadgeColor(material.type)}`}
                    >
                      {material.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
                    <span>{material.size}</span>
                  </div>
                  {material.description && (
                    <p className="line-clamp-2 text-muted-foreground">{material.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-border/50 pt-3">
                  {material.url ? (
                    <>
                      <Button
                        className="flex-1 gap-2"
                        variant="default"
                        size="sm"
                        asChild
                      >
                        <a href={material.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                        <a href={material.url} target="_blank" rel="noopener noreferrer" title="Open in new tab">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </>
                  ) : (
                    <Button className="flex-1" variant="outline" size="sm" disabled>
                      Not available
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
