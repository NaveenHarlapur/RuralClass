"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Upload,
  FileText,
  Video,
  X,
  CheckCircle,
  Cloud,
  Zap,
  Loader2,
  Music,
  FileArchive,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ── Static course list — always available, no API needed ──
const COURSES = [
  "C",
  "C++",
  "Java",
  "Python",
  "DSA",
  "OOPS",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Machine Learning",
  "Artificial Intelligence",
  "Cloud Computing",
  "Full Stack Development",
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Cyber Security",
  "DevOps",
  "Software Engineering",
  "UI/UX Design",
]

interface Material {
  id: string
  title: string
  file_size: string
  file_type: string | null
  status: string
  created_at: string
  subject: string | null
}

const ALLOWED_EXT = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.mp4', '.webm', '.mp3', '.zip']
const MAX_MB = 100

function FileIcon({ file }: { file: File }) {
  if (file.type.includes('video')) return <Video className="h-5 w-5 text-primary" />
  if (file.type.includes('audio')) return <Music className="h-5 w-5 text-primary" />
  if (file.name.toLowerCase().endsWith('.zip')) return <FileArchive className="h-5 w-5 text-primary" />
  return <FileText className="h-5 w-5 text-primary" />
}

function MaterialIcon({ type }: { type: string | null }) {
  const t = (type || '').toLowerCase()
  if (['mp4', 'webm'].includes(t)) return <Video className="h-5 w-5 text-primary" />
  if (t === 'mp3') return <Music className="h-5 w-5 text-primary" />
  if (t === 'zip') return <FileArchive className="h-5 w-5 text-primary" />
  return <FileText className="h-5 w-5 text-primary" />
}

export default function UploadPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [materialsLoading, setMaterialsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const [title, setTitle] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [description, setDescription] = useState('')
  const [lowBandwidth, setLowBandwidth] = useState(false)

  // ── Fetch recent uploads ─────────────────────────────────
  const fetchMaterials = useCallback(() => {
    setMaterialsLoading(true)
    fetch('/api/teacher/materials')
      .then(r => r.ok ? r.json() : [])
      .then((data: Material[]) => { if (Array.isArray(data)) setMaterials(data) })
      .catch(() => {})
      .finally(() => setMaterialsLoading(false))
  }, [])

  useEffect(() => { fetchMaterials() }, [fetchMaterials])

  // ── Drag & drop ──────────────────────────────────────────
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.length) addFiles(Array.from(e.dataTransfer.files))
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  const addFiles = (incoming: File[]) => {
    const valid = incoming.filter(f => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase()
      if (!ALLOWED_EXT.includes(ext)) { toast.error(`"${f.name}" — unsupported type`); return false }
      if (f.size > MAX_MB * 1024 * 1024) { toast.error(`"${f.name}" exceeds 100 MB`); return false }
      return true
    })
    if (valid.length) setSelectedFiles(prev => [...prev, ...valid])
  }

  const removeFile = (i: number) => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async (status: 'published' | 'draft') => {
    if (!title.trim()) { toast.error('Please enter a title'); return }
    if (!selectedCourse) { toast.error('Please select a subject / course'); return }
    if (selectedFiles.length === 0 && status === 'published') {
      toast.error('Please select at least one file to upload')
      return
    }

    setIsUploading(true)
    setUploadProgress(10)
    const timer = setInterval(() => setUploadProgress(p => p >= 90 ? 90 : p + 8), 180)

    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('subject', selectedCourse)
      formData.append('description', description.trim())
      formData.append('status', status)

      if (selectedFiles[0]) {
        formData.append('file', selectedFiles[0])
      }

      const res = await fetch('/api/teacher/materials', {
        method: 'POST',
        body: formData,
      })

      clearInterval(timer)
      setUploadProgress(100)

      if (res.ok) {
        const result = await res.json()
        fetchMaterials()
        setSelectedFiles([])
        setTitle('')
        setSelectedCourse('')
        setDescription('')
        setLowBandwidth(false)
        toast.success(status === 'published' ? '✅ Material uploaded!' : '📝 Draft saved!')
      } else {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || 'Upload failed — please try again')
      }
    } catch {
      clearInterval(timer)
      toast.error('Network error — please try again')
    } finally {
      setTimeout(() => { setIsUploading(false); setUploadProgress(0) }, 600)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Content</h1>
        <p className="mt-1 text-muted-foreground">Share study materials with your students</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Upload Form ──────────────────────────────────── */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Upload New Material</CardTitle>
              <CardDescription>Upload notes, videos, or other study materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">

                {/* Drop Zone */}
                <div
                  className={cn(
                    "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                    dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    isUploading && "pointer-events-none opacity-50"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.webm,.mp3,.zip"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleFileInput}
                    disabled={isUploading}
                  />
                  <div className="pointer-events-none flex flex-col items-center gap-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <Cloud className="h-7 w-7 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">Drag and drop files here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, PPT, MP4, MP3, ZIP — max 100 MB</p>
                  </div>
                </div>

                {/* Upload progress */}
                {isUploading && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Uploading…</span><span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Selected files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files</Label>
                    <div className="space-y-2">
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <FileIcon file={file} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFile(i)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="mat-title">Title *</Label>
                  <Input
                    id="mat-title"
                    placeholder="e.g. Python Basics — Lecture 3"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    disabled={isUploading}
                  />
                </div>

                {/* Subject dropdown — shadcn Select with hardcoded courses */}
                <div className="space-y-2">
                  <Label htmlFor="mat-course">Subject / Course *</Label>
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                    disabled={isUploading}
                  >
                    <SelectTrigger id="mat-course" className="w-full">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {COURSES.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="mat-desc">Description (optional)</Label>
                  <Textarea
                    id="mat-desc"
                    placeholder="Describe the content…"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    disabled={isUploading}
                  />
                </div>

                {/* Low Bandwidth */}
                <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Low Bandwidth Optimization</p>
                    <p className="text-sm text-muted-foreground">Compress files for students with slow internet</p>
                  </div>
                  <Button type="button" variant={lowBandwidth ? "default" : "outline"} size="sm"
                    disabled={isUploading}
                    onClick={() => setLowBandwidth(b => !b)}>
                    {lowBandwidth ? "Enabled" : "Enable"}
                  </Button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button type="button" className="gap-2" disabled={isUploading}
                    onClick={() => handleSubmit('published')}>
                    {isUploading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Upload className="h-4 w-4" />}
                    Upload Material
                  </Button>
                  <Button type="button" variant="outline" disabled={isUploading}
                    onClick={() => handleSubmit('draft')}>
                    Save as Draft
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Recent Uploads ────────────────────────────────── */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Uploads</CardTitle>
              <CardDescription>Your recently uploaded materials</CardDescription>
            </CardHeader>
            <CardContent>
              {materialsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : materials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="mb-3 h-12 w-12 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-foreground">No uploads yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Upload your first material above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map(m => (
                    <div key={m.id} className="rounded-lg border border-border/50 bg-muted/30 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <MaterialIcon type={m.file_type} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{m.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {m.file_size} &bull; {new Date(m.created_at).toLocaleDateString()}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {m.status === 'draft' ? (
                              <Badge variant="outline" className="h-4 text-[10px]">Draft</Badge>
                            ) : (
                              <Badge variant="secondary" className="h-4 gap-1 text-[10px]">
                                <CheckCircle className="h-2.5 w-2.5" />
                                Published
                              </Badge>
                            )}
                            {m.subject && (
                              <span className="truncate text-[10px] text-muted-foreground">
                                {m.subject}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-accent/30 bg-accent/10">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground">Upload Tips</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Use descriptive titles for easy search</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Enable low bandwidth for rural students</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Save as draft to publish later</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
