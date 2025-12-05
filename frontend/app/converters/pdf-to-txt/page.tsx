"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    "http://127.0.0.1:8000/api/pdf-to-txt/",
    (name) => name.replace(/\.pdf$/i, ".txt")
  );

  return (
    <ConverterWrapper
      title="PDF → TXT"
      description="Extract readable text from your PDF using OCR + text extraction."
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
