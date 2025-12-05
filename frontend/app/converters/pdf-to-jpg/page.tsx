"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    "http://127.0.0.1:8000/api/pdf-to-jpg/",
    (name) => name.replace(/\.pdf$/i, ".jpg")
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
