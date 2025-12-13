FROM python:3.12-slim

# Set workdir
WORKDIR /app

# Install system dependencies
# - poppler-utils → required for pdf2image
# - tesseract-ocr & libtesseract-dev → OCR support
# - fonts-dejavu → ReportLab and PIL font rendering
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    libtesseract-dev \
    fonts-dejavu \
    build-essential \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project source
COPY . .

# Disable Python buffering
ENV PYTHONUNBUFFERED=1

# Gunicorn entrypoint
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
