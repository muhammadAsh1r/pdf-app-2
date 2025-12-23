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

export function FileConverter({ title, description, acceptedFormats, apiEndpoint, outputFormat }: FileConverterProps) {
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
    accept: acceptedFormats.reduce(
      (acc, format) => ({
        ...acc,
        [format]: [],
      }),
      {},
    ),
    multiple: false,
  })

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint}`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      })

      clearInterval(progressInterval)

      if (response.status === 429) {
        setLimitReached(true)
        throw new Error("Daily conversion limit reached")
      }

      if (!response.ok) {
        throw new Error("Conversion failed")
      }

      // Create blob from response
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      setProgress(100)
      setConvertedFileUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during conversion")
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (convertedFileUrl && file) {
      const link = document.createElement("a")
      link.href = convertedFileUrl
      link.download = `${file.name.split(".")[0]}.${outputFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
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

          {/* File Preview */}
          {file && !convertedFileUrl && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                  Remove
                </Button>
              </div>

              {isConverting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
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

          {/* Success State */}
          {convertedFileUrl && (
            <div className="space-y-4">
              <Alert className="border-accent bg-accent/5">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <AlertDescription>Your file has been converted successfully!</AlertDescription>
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

          {/* Error State */}
          {error && !limitReached && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Limit Reached */}
          {limitReached && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                <p className="mb-2 font-medium">Daily conversion limit reached</p>
                <p className="text-sm">Upgrade to Pro for unlimited conversions</p>
                <Button size="sm" className="mt-3">
                  Upgrade Now
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium">Fast Conversion</p>
            <p className="text-xs text-muted-foreground">Process files in seconds</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium">Secure Processing</p>
            <p className="text-xs text-muted-foreground">Files deleted after 1 hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium">High Quality</p>
            <p className="text-xs text-muted-foreground">Preserves formatting</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
