"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface FileConverterProps {
  title: string
  description: string
  acceptedFormats: string[]
  apiEndpoint: string
  outputFormat: string
}

export function FileConverter({
  title,
  description,
  acceptedFormats,
  apiEndpoint,
  outputFormat,
}: FileConverterProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setConvertedFileUrl(null)
      setError(null)
      setLimitReached(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce<Record<string, never[]>>((acc, format) => {
      acc[format] = []
      return acc
    }, {}),
    multiple: false,
  })

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setProgress(0)
    setError(null)
    setLimitReached(false)

    const formData = new FormData()
    formData.append("file", file)

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10))
    }, 200)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint}`,
        {
          method: "POST",
          body: formData,
          credentials: "include", // ✅ send auth cookies
        }
      )

      clearInterval(progressInterval)

      if (response.status === 401) {
        throw new Error("You are not authenticated. Please log in again.")
      }

      if (response.status === 429) {
        setLimitReached(true)
        throw new Error("Daily conversion limit reached.")
      }

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || "Conversion failed.")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      setProgress(100)
      setConvertedFileUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      clearInterval(progressInterval)
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!convertedFileUrl || !file) return
    const link = document.createElement("a")
    link.href = convertedFileUrl
    link.download = `${file.name.split(".")[0]}.${outputFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload */}
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="mb-2 text-lg font-medium">
                {isDragActive ? "Drop your file here" : "Drag and drop your file here"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <p className="text-xs text-muted-foreground">
                Accepted formats: {acceptedFormats.map((f) => f.split("/")[1]).join(", ")}
              </p>
            </div>
          )}

          {/* Preview */}
          {file && !convertedFileUrl && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                  Remove
                </Button>
              </div>

              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Converting...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {!isConverting && !error && (
                <Button onClick={handleConvert} className="w-full" size="lg">
                  Convert to {outputFormat.toUpperCase()}
                </Button>
              )}
            </div>
          )}

          {/* Success */}
          {convertedFileUrl && (
            <div className="space-y-4">
              <Alert className="border-accent bg-accent/5">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <AlertDescription>
                  Your file has been converted successfully!
                </AlertDescription>
              </Alert>

              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download {outputFormat.toUpperCase()}
              </Button>

              <Button
                onClick={() => {
                  setFile(null)
                  setConvertedFileUrl(null)
                }}
                variant="outline"
                className="w-full"
              >
                Convert Another File
              </Button>
            </div>
          )}

          {/* Error */}
          {error && !limitReached && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Limit */}
          {limitReached && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                <p className="mb-2 font-medium">Daily conversion limit reached</p>
                <p className="text-sm">Upgrade to Pro for unlimited conversions</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
