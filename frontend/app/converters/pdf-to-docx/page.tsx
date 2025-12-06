"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    // "http://127.0.0.1:8000/api/pdf-to-docx/",
    "https://pdf-app-2-cizg.onrender.com/api/pdf-to-docx/",
    (name) => name.replace(/\.pdf$/i, ".docx")
  );

  return (
    <ConverterWrapper
      title="PDF → DOCX"
      description="Convert your PDF file into an editable Word document."
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
