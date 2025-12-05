"use client";

import ConverterWrapper from "@/components/ConverterWrapper";
import FileDropzone from "@/components/FileDropzone";
import { useFileUploader } from "@/hooks/useFileUploader";

export default function Page() {
  const { upload, loading, message } = useFileUploader(
    "http://127.0.0.1:8000/api/images-to-pdf/",
    () => "images.pdf"
  );

  return (
    <ConverterWrapper
      title="Images → PDF"
      description="Combine multiple images into a single PDF file."
      message={message}
    >
      <FileDropzone
        onFileSelect={upload}
        accept="image/*"
        loading={loading}
      />
    </ConverterWrapper>
  );
}
