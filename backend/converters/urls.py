from django.urls import path
from .views import (
    ConvertPdfToDocxView,
    ConvertPdfToJpgView,
    ConvertPdfToExcelView,
    ConvertPdfToPptxView,
    ConvertPdfToTxtView,
    ConvertDocxToPdfView,
    ConvertImagesToPdfView,   
    ConvertExcelToPdfView,
    ConvertPptxToPdfView,
    ConvertTxtToPdfView,
)

urlpatterns = [
    path('pdf-to-docx/', ConvertPdfToDocxView.as_view(), name='convert-pdf-to-docx'),
    path('pdf-to-jpg/', ConvertPdfToJpgView.as_view(), name='convert-pdf-to-jpg'),
    path('pdf-to-excel/', ConvertPdfToExcelView.as_view(), name='convert-pdf-to-excel'),
    path('pdf-to-pptx/', ConvertPdfToPptxView.as_view(), name='convert-pdf-to-pptx'),
    path('pdf-to-txt/', ConvertPdfToTxtView.as_view(), name='convert-pdf-to-txt'),
    path('docx-to-pdf/', ConvertDocxToPdfView.as_view(), name='convert-docx-to-pdf'),
    path('images-to-pdf/', ConvertImagesToPdfView.as_view(), name='convert-images-to-pdf'),
    path('excel-to-pdf/', ConvertExcelToPdfView.as_view(), name='convert-excel-to-pdf'),
    path('pptx-to-pdf/', ConvertPptxToPdfView.as_view(), name='convert-pptx-to-pdf'),
    path('txt-to-pdf/', ConvertTxtToPdfView.as_view(), name='convert-txt-to-pdf'),

]
