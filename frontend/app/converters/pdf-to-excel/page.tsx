"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    "http://127.0.0.1:8000/api/pdf-to-excel/",
    (name) => name.replace(/\.pdf$/i, ".xlsx")
  );

  return (
    <ConverterWrapper
      title="PDF → EXCEL"
      description="Extract tables from PDF files into Excel spreadsheets."
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
