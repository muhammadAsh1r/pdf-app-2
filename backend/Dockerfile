FROM python:3.12-slim

# Set workdir
WORKDIR /app

# Install system dependencies
# - poppler-utils  → pdf2image
# - tesseract-ocr  → OCR
# - libreoffice    → PPT/PPTX → PDF
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    libtesseract-dev \
    libreoffice \
    build-essential \
    fonts-dejavu \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY . .

# Environment
ENV PYTHONUNBUFFERED=1

# Django + gunicorn
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
