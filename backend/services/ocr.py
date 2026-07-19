import os
import logging
import cv2

logger = logging.getLogger(__name__)

def preprocess_image(file_path: str) -> str:
    """Preprocesses image using OpenCV to improve OCR accuracy."""
    logger.info(f"Preprocessing image with OpenCV: {file_path}")
    try:
        # Load image
        img = cv2.imread(file_path)
        if img is None:
            raise ValueError(f"Could not read image at path: {file_path}")
            
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian Blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply Otsu's thresholding
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        
        # Save preprocessed image to a temp file
        temp_dir = os.path.dirname(file_path)
        base_name = os.path.basename(file_path)
        preprocessed_path = os.path.join(temp_dir, f"preprocessed_{base_name}")
        
        cv2.imwrite(preprocessed_path, thresh)
        logger.info(f"Preprocessed image saved to {preprocessed_path}")
        return preprocessed_path
    except Exception as e:
        logger.error(f"OpenCV preprocessing failed: {e}. Using original image.")
        return file_path

def extract_text_from_image(file_path: str) -> str:
    """Extracts text from image using PaddleOCR."""
    logger.info(f"Extracting text from image file: {file_path}")
    
    preprocessed_path = preprocess_image(file_path)
    
    try:
        from paddleocr import PaddleOCR
        # Initialize PaddleOCR (uses English and disables logs)
        ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
        
        # Perform OCR
        result = ocr.ocr(preprocessed_path, cls=True)
        
        extracted_lines = []
        if result and result[0]:
            for line in result[0]:
                text_line = line[1][0]
                extracted_lines.append(text_line)
                
        extracted_text = " ".join(extracted_lines)
        logger.info("PaddleOCR text extraction successful.")
        
        # Clean up preprocessed file if we created one
        if preprocessed_path != file_path and os.path.exists(preprocessed_path):
            os.remove(preprocessed_path)
            
        return extracted_text
    except Exception as e:
        logger.warning(f"PaddleOCR extraction failed or not installed: {e}. Falling back to default mocks.")
        
    # Clean up preprocessed file if needed
    if preprocessed_path != file_path and os.path.exists(preprocessed_path):
        try:
            os.remove(preprocessed_path)
        except Exception:
            pass
            
    # Default return for general screenshots if OCR fails
    return ""
