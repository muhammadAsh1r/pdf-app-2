"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    "http://127.0.0.1:8000/api/txt-to-pdf/",
    (name) => name.replace(/\.txt$/i, ".pdf")
  );

  return (
    <ConverterWrapper
      title="TXT → PDF"
      description="Convert plain text files into formatted PDF documents."
      message={message}
    >
      <FileDropzone
        onFileSelect={upload}
        accept=".txt,text/plain"
        loading={loading}
      />
    </ConverterWrapper>
  );
}
