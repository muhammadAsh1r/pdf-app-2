"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    // "http://127.0.0.1:8000/api/excel-to-pdf/",
    "http://localhost:8000/api/excel-to-pdf/",
    (name) => name.replace(/\.(xls|xlsx)$/i, ".pdf")
  );

  return (
    <ConverterWrapper
      title="EXCEL → PDF"
      description="Convert Excel spreadsheets into clean PDF sheets."
      message={message}
    >
      <FileDropzone
        onFileSelect={upload}
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        loading={loading}
      />
    </ConverterWrapper>
  );
}
