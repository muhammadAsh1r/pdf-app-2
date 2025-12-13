from rest_framework import serializers


# =========================
# TXT → PDF
# =========================
class TXTToPDFSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        name = getattr(value, "name", "").lower()
        if not name.endswith(".txt"):
            raise serializers.ValidationError("Uploaded file must be a .txt file.")

        if value.size > 20 * 1024 * 1024:
            raise serializers.ValidationError("File too large (max 20 MB).")

        return value


# =========================
# PPTX → PDF
# =========================
class PPTXToPDFSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        name = getattr(value, "name", "").lower()
        if not name.endswith((".pptx", ".ppt")):
            raise serializers.ValidationError("Uploaded file must be a .pptx or .ppt file.")

        if value.size > 100 * 1024 * 1024:
            raise serializers.ValidationError("File too large (max 100 MB).")

        return value


# =========================
# Excel → PDF  (LibreOffice removed)
# =========================
class ExcelToPDFSerializer(serializers.Serializer):
    file = serializers.FileField()

    # ❌ Removed "soffice"
    backend = serializers.ChoiceField(
        required=False,
        choices=["reportlab"],
        default="reportlab"
    )

    page_size = serializers.ChoiceField(
        required=False,
        choices=["A4", "LETTER"],
        default="A4"
    )

    def validate_file(self, value):
        name = getattr(value, "name", "").lower()
        if not name.endswith((".xlsx", ".xls")):
            raise serializers.ValidationError("Uploaded file must be an Excel (.xlsx or .xls) file.")

        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError("File too large (max 50 MB).")

        return value


# =========================
# Images → PDF
# =========================
class ImagesToPDFSerializer(serializers.Serializer):
    """
    Supports either:
      - files[] (multiple images)
      - file (single image)
    """

    files = serializers.ListField(
        child=serializers.FileField(),
        required=False,
        allow_empty=False
    )
    file = serializers.FileField(required=False)

    def validate(self, attrs):
        files_list = attrs.get("files")
        single = attrs.get("file")

        if not files_list and not single:
            raise serializers.ValidationError("No images provided. Use 'files' (multiple) or 'file' (single).")

        if single and not files_list:
            attrs["files"] = [single]

        return attrs


# =========================
# DOCX → PDF
# =========================
class DocxToPdfSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        name = getattr(value, "name", "").lower()
        if not name.endswith((".docx", ".doc")):
            raise serializers.ValidationError("Uploaded file must be a .docx or .doc file.")

        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError("File too large (max 50 MB).")

        return value


# =========================
# Generic PDF Upload
# =========================
class PDFUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        name = getattr(value, "name", "").lower()
        if not name.endswith(".pdf"):
            raise serializers.ValidationError("Uploaded file must be a PDF.")

        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError("File too large (max 50 MB).")

        return value


# =========================
# PDF → TXT
# =========================
class PDFToTxtSerializer(PDFUploadSerializer):
    ocr = serializers.BooleanField(required=False, default=True)
    lang = serializers.CharField(required=False, default="eng")
    join_pages = serializers.CharField(required=False, default="\n\n----- PAGE BREAK -----\n\n")
    preserve_layout = serializers.BooleanField(required=False, default=True)


# =========================
# PDF → PPTX
# =========================
class PDFToPPTXSerializer(PDFUploadSerializer):
    dpi = serializers.IntegerField(required=False, min_value=72, max_value=400, default=150)


# =========================
# PDF → JPG
# =========================
class PDFToJPGSerializer(PDFUploadSerializer):
    dpi = serializers.IntegerField(required=False, min_value=50, max_value=600, default=200)
    first_page_only = serializers.BooleanField(required=False, default=False)
