"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    "http://127.0.0.1:8000/api/docx-to-pdf/",
    (name) => name.replace(/\.(doc|docx)$/i, ".pdf")
  );

  return (
    <ConverterWrapper
      title="DOCX → PDF"
      description="Convert Microsoft Word documents into PDF files."
      message={message}
    >
      <FileDropzone
        onFileSelect={upload}
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        loading={loading}
      />
    </ConverterWrapper>
  );
}
