from rest_framework import serializers

class TXTToPDFSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        name = getattr(value, "name", "") or ""
        if not name.lower().endswith(".txt"):
            raise serializers.ValidationError("Uploaded file must be a .txt file.")
        max_size = 20 * 1024 * 1024  # 20 MB limit
        if value.size > max_size:
            raise serializers.ValidationError("File too large (max 20 MB).")
        return value


class PPTXToPDFSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        name = getattr(value, "name", "") or ""
        if not name.lower().endswith((".pptx", ".ppt")):
            raise serializers.ValidationError("Uploaded file must be a PowerPoint (.pptx or .ppt).")
        max_size = 100 * 1024 * 1024  # 100 MB default limit - adjust as you wish
        if value.size > max_size:
            raise serializers.ValidationError("File too large (max 100 MB).")
        return value

class ExcelToPDFSerializer(serializers.Serializer):
    file = serializers.FileField()

    # optional: choose "fast" (reportlab table render) or "soffice" (libreoffice) for high fidelity
    backend = serializers.ChoiceField(required=False, choices=["soffice", "reportlab"], default="soffice")
    page_size = serializers.ChoiceField(required=False, choices=["A4", "LETTER"], default="A4")

    def validate_file(self, value):
        name = getattr(value, "name", "") or ""
        if not name.lower().endswith((".xlsx", ".xls")):
            raise serializers.ValidationError("Uploaded file must be an Excel .xlsx or .xls file.")
        max_size = 50 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("File too large (max 50 MB).")
        return value


class ImagesToPDFSerializer(serializers.Serializer):
    """
    Accepts multiple image files via 'files' or a single image via 'file'.
    For multipart/form-data clients:
      - Multiple: files[] (repeat the key)
      - Single: file
    """
    # Optional: support both a list field (for some clients) and single file field
    files = serializers.ListField(child=serializers.FileField(), required=False, allow_empty=False)
    file = serializers.FileField(required=False)

    def validate(self, attrs):
        files = attrs.get("files")
        single = attrs.get("file")
        if not files and not single:
            raise serializers.ValidationError("No images provided. Use 'files' (multiple) or 'file' (single).")
        # consolidate list of files into 'files' for easier use downstream
        if single and not files:
            attrs["files"] = [single]
        return attrs


class DocxToPdfSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        # basic check
        name = getattr(value, "name", "") or ""
        if not name.lower().endswith((".docx", ".doc")):
            raise serializers.ValidationError("Uploaded file must be a .docx or .doc file.")
        # reuse same max-size logic (50MB)
        max_size = 50 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("File too large (max 50 MB).")
        return value


class PDFUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("Uploaded file must be a PDF.")
        max_size = 50 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("File too large (max 50 MB).")
        return value


class PDFToTxtSerializer(PDFUploadSerializer):
    ocr = serializers.BooleanField(required=False, default=True)
    lang = serializers.CharField(required=False, default="eng")
    join_pages = serializers.CharField(required=False, default="\n\n----- PAGE BREAK -----\n\n")
    preserve_layout = serializers.BooleanField(required=False, default=True)


class PDFToPPTXSerializer(PDFUploadSerializer):
    dpi = serializers.IntegerField(required=False, min_value=72, max_value=400, default=150)


class PDFToJPGSerializer(PDFUploadSerializer):
    dpi = serializers.IntegerField(required=False, min_value=50, max_value=600, default=200)
    first_page_only = serializers.BooleanField(required=False, default=False)
