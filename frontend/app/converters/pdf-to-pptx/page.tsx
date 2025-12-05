"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    "http://127.0.0.1:8000/api/pdf-to-pptx/",
    (name) => name.replace(/\.pdf$/i, ".pptx")
  );

  return (
    <ConverterWrapper
      title="PDF → PPTX"
      description="Convert each page of your PDF into a clean PowerPoint slide."
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
