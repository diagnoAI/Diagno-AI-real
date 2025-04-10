import cv2
import numpy as np

def adjusted_is_grayscale(image):
    if len(image.shape) == 2 or image.shape[2] == 1:
        return True
    b, g, r = cv2.split(image)
    return np.allclose(b, g, atol=5) and np.allclose(g, r, atol=5)

def adjusted_check_intensity(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
    avg_intensity = np.mean(gray_image)
    std_intensity = np.std(gray_image)
    return 10 < avg_intensity < 200, avg_intensity, std_intensity

def validate_image(image_path):
    try:
        img = cv2.imread(image_path)
        if img is None:
            return False, "Invalid image file. Could not load image."

        img = cv2.resize(img, (224, 224))

        if not adjusted_is_grayscale(img):
            return False, "The image is not grayscale or does not visually appear grayscale."

        intensity_valid, avg_intensity, std_intensity = adjusted_check_intensity(img)
        if not intensity_valid:
            return False, f"The image does not have typical CT scan intensity. Avg: {avg_intensity:.2f}, Std: {std_intensity:.2f}"

        return True, "Valid kidney CT scan detected."
    except Exception as e:
        return False, f"Error validating image: {str(e)}"