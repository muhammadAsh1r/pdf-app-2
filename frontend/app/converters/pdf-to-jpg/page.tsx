"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    // "http://localhost:8000/api/pdf-to-jpg/",
    "http://localhost:8000/api/pdf-to-jpg/",
    (name) => name.replace(/\.pdf$/i, ".zip")
  );

  return (
    <ConverterWrapper
      title="PDF → JPG"
      description="Convert PDF pages into high-quality JPG images."
      message={message}
    >
      <FileDropzone
        onFileSelect={upload}
        accept="application/pdf"
        loading={loading}
      />
    </ConverterWrapper>
  );
}
