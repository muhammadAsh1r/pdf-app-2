# === Django / DRF Imports ===
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# === Serializers ===
from .serializers import (
    PDFUploadSerializer,
    PDFToJPGSerializer,
    PDFToPPTXSerializer,
    PDFToTxtSerializer,
    DocxToPdfSerializer,
    ImagesToPDFSerializer,
    ExcelToPDFSerializer,
    PPTXToPDFSerializer,
    TXTToPDFSerializer,
)

# === Utils (conversion functions) ===
from .utils import (
    pdf_to_docx_bytes,
    pdf_to_jpg_bytes,
    pdf_to_excel_bytes,
    pdf_to_pptx_bytes,
    pdf_to_txt_bytes,
    docx_to_pdf_bytes,
    images_to_pdf_bytes,
    xlsx_to_pdf_bytes,
    pptx_to_pdf_bytes,
    txt_to_pdf_bytes,
)

class ConvertTxtToPdfView(APIView):
    """
    POST /api/txt-to-pdf/
    Form-data:
      - file (.txt)
    Response: application/pdf
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = TXTToPDFSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        txt_file = serializer.validated_data["file"]

        try:
            pdf_bytes = txt_to_pdf_bytes(txt_file)
        except Exception as e:
            return Response(
                {"detail": f"Failed to convert TXT to PDF. {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        filename = txt_file.name.rsplit(".", 1)[0] + ".pdf"
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Content-Length"] = str(len(pdf_bytes))
        return response


class ConvertPptxToPdfView(APIView):
    """
    POST /api/pptx-to-pdf/
    Form-data:
      - file (pptx or ppt)
    Response: application/pdf
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PPTXToPDFSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        pptx_file = serializer.validated_data["file"]

        try:
            pdf_bytes = pptx_to_pdf_bytes(pptx_file)
        except Exception as e:
            return Response({"detail": f"Failed to convert PowerPoint to PDF. {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        filename = (pptx_file.name.rsplit(".", 1)[0] if pptx_file.name else "presentation") + ".pdf"
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Content-Length"] = str(len(pdf_bytes))
        return response



class ConvertExcelToPdfView(APIView):
    """
    POST /api/excel-to-pdf/
    Form-data:
      - file (xlsx/xls)
      - page_size (optional): "A4" or "LETTER"
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ExcelToPDFSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        excel_file = serializer.validated_data["file"]
        page_size_choice = serializer.validated_data.get("page_size", "A4")

        from reportlab.lib.pagesizes import A4, letter
        page_size = A4 if page_size_choice == "A4" else letter

        try:
            # FORCE reportlab backend → LibreOffice removed
            pdf_bytes = xlsx_to_pdf_bytes(
                excel_file,
                page_size=page_size,
                backend="reportlab"
            )
        except Exception as e:
            return Response({"detail": f"Failed to convert Excel to PDF. {e}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        filename = (excel_file.name.rsplit(".", 1)[0] if excel_file.name else "output") + ".pdf"
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Content-Length"] = str(len(pdf_bytes))
        return response


class ConvertImagesToPdfView(APIView):
    """
    POST /api/images-to-pdf/
    Form-data:
      - files[] (multiple) OR
      - file (single)
    Response: application/pdf
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # use serializer to validate presence of files
        serializer = ImagesToPDFSerializer(data=request.data)
        if not serializer.is_valid():
            # If serializer fails, also try to extract files from request.FILES directly for multipart clients
            # (some clients don't populate data for ListField properly)
            files_from_request = request.FILES.getlist("files") or ( [request.FILES.get("file")] if request.FILES.get("file") else [] )
            if not files_from_request:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            files = files_from_request
        else:
            files = serializer.validated_data.get("files", [])

        # convert images to pdf bytes
        try:
            pdf_bytes = images_to_pdf_bytes(files)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Failed to convert images to PDF. {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        filename = "images.pdf"
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Content-Length"] = str(len(pdf_bytes))
        return response


class ConvertDocxToPdfView(APIView):
    """
    POST /api/docx-to-pdf/
    Form-data:
      - file (docx or doc)
    Response: application/pdf
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = DocxToPdfSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uploaded = serializer.validated_data["file"]
        try:
            pdf_bytes = docx_to_pdf_bytes(uploaded)
        except Exception as e:
            # don't leak too much info in production; returning for dev purposes
            return Response({"detail": f"Failed to convert DOCX to PDF. {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        filename = (uploaded.name.rsplit(".", 1)[0] if uploaded.name else "output") + ".pdf"
        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Content-Length"] = str(len(pdf_bytes))
        return response


class ConvertPdfToTxtView(APIView):
    """
    POST /api/pdf-to-txt/
    Form-data:
      - file (pdf)
      - ocr (bool)
      - lang (tesseract language)
      - join_pages ("none" | "space" | "newline")
      - preserve_layout (bool)
    Response: text/plain (.txt)
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PDFToTxtSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        pdf_file = serializer.validated_data["file"]
        ocr = serializer.validated_data.get("ocr", True)
        lang = serializer.validated_data.get("lang", "eng")
        join_pages = serializer.validated_data.get("join_pages")
        preserve_layout = serializer.validated_data.get("preserve_layout", True)

        try:
            txt_bytes = pdf_to_txt_bytes(
                pdf_file,
                ocr=ocr,
                lang=lang,
                join_pages=join_pages,
                preserve_layout=preserve_layout
            )
        except Exception as e:
            return Response(
                {"detail": f"Failed to convert PDF to TXT. {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        filename = pdf_file.name.rsplit(".", 1)[0] + ".txt"
        response = HttpResponse(txt_bytes, content_type="text/plain; charset=utf-8")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Content-Length"] = str(len(txt_bytes))
        return response


class ConvertPdfToPptxView(APIView):
    """
    POST /api/pdf-to-pptx/
    Form-data:
      - file (pdf)
      - dpi (int, default 150)
    Response: .pptx file
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PDFToPPTXSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        pdf_file = serializer.validated_data["file"]
        dpi = serializer.validated_data.get("dpi", 150)

        try:
            pptx_bytes = pdf_to_pptx_bytes(pdf_file, dpi=dpi)
        except Exception as e:
            return Response(
                {"detail": f"Failed to convert PDF to PPTX. {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        filename = pdf_file.name.rsplit(".", 1)[0] + ".pptx"
        response = HttpResponse(
            pptx_bytes,
            content_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Content-Length"] = str(len(pptx_bytes))
        return response


class ConvertPdfToExcelView(APIView):
    """
    POST /api/pdf-to-excel/
    Response: .xlsx file
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PDFUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        pdf_file = serializer.validated_data["file"]

        try:
            xlsx_bytes = pdf_to_excel_bytes(pdf_file)
        except Exception as e:
            return Response(
                {"detail": f"Failed to convert PDF to Excel. {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        filename = pdf_file.name.rsplit(".", 1)[0] + ".xlsx"
        response = HttpResponse(
            xlsx_bytes,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Content-Length"] = str(len(xlsx_bytes))
        return response


class ConvertPdfToDocxView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PDFUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        pdf_file = serializer.validated_data["file"]

        try:
            docx_bytes = pdf_to_docx_bytes(pdf_file)
        except Exception as e:
            return Response(
                {"detail": f"Failed to convert PDF. {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        filename = pdf_file.name.rsplit(".", 1)[0] + ".docx"
        response = HttpResponse(
            docx_bytes,
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["Content-Length"] = str(len(docx_bytes))
        return response


class ConvertPdfToJpgView(APIView):
    """
    POST /api/pdf-to-jpg/
    Optional:
      - dpi (int)
      - first_page_only (bool)
    Returns JPEG or ZIP
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PDFToJPGSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        pdf_file = serializer.validated_data["file"]
        dpi = serializer.validated_data.get("dpi", 200)
        first_page_only = serializer.validated_data.get("first_page_only", False)

        try:
            out_bytes, out_filename, content_type = pdf_to_jpg_bytes(
                pdf_file,
                filename=pdf_file.name,
                dpi=dpi,
                first_only=first_page_only
            )
        except Exception as e:
            return Response(
                {"detail": f"Failed to convert PDF to JPG. {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        response = HttpResponse(out_bytes, content_type=content_type)
        response["Content-Disposition"] = f'attachment; filename="{out_filename}"'
        response["Content-Length"] = str(len(out_bytes))
        return response


