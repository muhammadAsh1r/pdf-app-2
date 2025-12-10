"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    // "http://127.0.0.1:8000/api/pptx-to-pdf/",
    "http://localhost:8000/api/pptx-to-pdf/",
    (name) => name.replace(/\.(ppt|pptx)$/i, ".pdf")
  );

  return (
    <ConverterWrapper
      title="PPTX → PDF"
      description="Convert PowerPoint slides into PDF documents."
      message={message}
    >
      <FileDropzone
        onFileSelect={upload}
        accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        loading={loading}
      />
    </ConverterWrapper>
  );
}
