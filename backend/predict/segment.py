import tensorflow as tf
import numpy as np
import cv2
import base64
from io import BytesIO
import os
import warnings
warnings.filterwarnings(action="ignore")
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Define custom metrics/losses (unchanged)
def dice_coefficient(y_true, y_pred, smooth=1):
    y_true_f = tf.keras.backend.flatten(y_true)
    y_pred_f = tf.keras.backend.flatten(y_pred)
    intersection = tf.keras.backend.sum(y_true_f * y_pred_f)
    return (2. * intersection + smooth) / (tf.keras.backend.sum(y_true_f) + tf.keras.backend.sum(y_pred_f) + smooth)

def dice_loss(y_true, y_pred):
    return 1 - dice_coefficient(y_true, y_pred)

def iou(y_true, y_pred, smooth=1):
    y_true_f = tf.keras.backend.flatten(y_true)
    y_pred_f = tf.keras.backend.flatten(y_pred)
    intersection = tf.keras.backend.sum(y_true_f * y_pred_f)
    union = tf.keras.backend.sum(y_true_f) + tf.keras.backend.sum(y_pred_f) - intersection
    return (intersection + smooth) / (union + smooth)

# Lazy-load the model
model = tf.keras.models.load_model('D:\\lastcheck 2\\Diagno AI real\\backend\\ai_models\\unet_aug.keras', 
                                   custom_objects={'dice_loss': dice_loss, 
                                                   'dice_coefficient': dice_coefficient, 
                                                   'iou': iou})


# Rest of your functions (unchanged until process_image_for_backend)
def preprocess_image(image_path, height=256, width=256):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError(f"Could not load image at {image_path}. Please check the path.")
    img = cv2.resize(img, (width, height))
    img = img / 255.0
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)
    return img.astype(np.float32)

def overlay_mask_on_image(input_image, mask, color=(1, 0, 0), alpha=0.5):
    input_image_rgb = np.repeat(input_image, 3, axis=-1)
    colored_mask = np.zeros_like(input_image_rgb)
    for c in range(3):
        colored_mask[:, :, c] = mask[:, :, 0] * color[c]
    overlay = input_image_rgb * (1 - alpha) + colored_mask * alpha
    return overlay

def get_number_of_stones(mask):
    mask = mask[0, :, :, 0]
    num_labels, _ = cv2.connectedComponents(mask.astype(np.uint8))
    return num_labels - 1

def get_kidney_side(mask, image_width=256):
    mask = mask[0, :, :, 0]
    num_labels, labels = cv2.connectedComponents(mask.astype(np.uint8))
    kidney_sides = []
    midline = image_width // 2
    for label in range(1, num_labels):
        stone_coords = np.where(labels == label)
        if len(stone_coords[0]) > 0:
            centroid_x = np.mean(stone_coords[1])
            side = "Right kidney" if centroid_x < midline else "Left kidney"
            kidney_sides.append((label, side))
    return kidney_sides

def get_stone_location(mask, image_height=256):
    mask = mask[0, :, :, 0]
    num_labels, labels = cv2.connectedComponents(mask.astype(np.uint8))
    locations = []
    pole_height = image_height // 3
    upper_limit = pole_height
    middle_limit = 2 * pole_height
    for label in range(1, num_labels):
        stone_coords = np.where(labels == label)
        if len(stone_coords[0]) > 0:
            centroid_y = np.mean(stone_coords[0])
            if centroid_y < upper_limit:
                location = "Upper pole"
            elif centroid_y < middle_limit:
                location = "Mid pole"
            else:
                location = "Lower pole"
            locations.append((label, location))
    return locations

def get_stone_size(mask, pixel_to_mm=0.5):
    mask = mask[0, :, :, 0]
    num_labels, labels = cv2.connectedComponents(mask.astype(np.uint8))
    sizes = []
    for label in range(1, num_labels):
        stone_pixels = np.sum(labels == label)
        size_mm = np.sqrt(stone_pixels) * pixel_to_mm
        sizes.append((label, size_mm))
    return sizes

def get_stone_shape(mask):
    mask = mask[0, :, :, 0]
    num_labels, labels = cv2.connectedComponents(mask.astype(np.uint8))
    shapes = []
    def calculate_circularity(labels, label):
        stone_pixels = np.sum(labels == label)
        if stone_pixels == 0:
            return 0.0
        stone_mask = (labels == label).astype(np.uint8)
        contours, _ = cv2.findContours(stone_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return 0.0
        perimeter = cv2.arcLength(contours[0], True)
        if perimeter == 0:
            return 0.0
        return 4 * np.pi * stone_pixels / (perimeter ** 2)
    
    def determine_shape(labels, label):
        stone_mask = (labels == label).astype(np.uint8)
        contours, _ = cv2.findContours(stone_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return "Unknown"
        
        contour = contours[0]
        circularity = calculate_circularity(labels, label)
        
        if len(contour) >= 5:
            ellipse = cv2.fitEllipse(contour)
            (major_axis, minor_axis) = ellipse[1]
            aspect_ratio = major_axis / minor_axis if minor_axis > 0 else 1.0
        else:
            aspect_ratio = 1.0
        
        if circularity > 0.9:
            return "Circular"
        elif circularity > 0.6 and aspect_ratio > 1.2:
            return "Oval"
        else:
            return "Irregular"
    
    for label in range(1, num_labels):
        shape = determine_shape(labels, label)
        shapes.append((label, shape))
    return shapes

def process_image_for_backend(image_path):
    try:
        # model = load_model()  # Load model only when needed
        input_image = preprocess_image(image_path)
        prediction = model.predict(input_image)
        prediction = (prediction > 0.5).astype(np.float32)

        overlay_image = overlay_mask_on_image(input_image[0], prediction[0])

        num_stones = get_number_of_stones(prediction)
        kidney_sides = get_kidney_side(prediction)
        locations = get_stone_location(prediction)
        sizes = get_stone_size(prediction)
        shapes = get_stone_shape(prediction)

        stones_info = {}
        for i in range(1, num_stones + 1):
            stone_key = f"Stone{i}"
            stones_info[stone_key] = {
                "left or right": next((side for label, side in kidney_sides if label == i), "Unknown"),
                "stone located": next((loc for label, loc in locations if label == i), "Unknown"),
                "Stone size": f"{next((size for label, size in sizes if label == i), 0):.1f}mm",
                "Stone shape": next((shape for label, shape in shapes if label == i), "Unknown")
            }

        _, buffer = cv2.imencode('.jpg', (overlay_image * 255).astype(np.uint8))
        overlay_base64 = base64.b64encode(buffer).decode('utf-8')

        print("model successfullpredicted")

        return {
            'overlay_image': overlay_base64,
            'stone_details': {
                'number_of_stones': num_stones,
                'stones': stones_info
            }
        }
    
    except Exception as e:
        return {
            'error': f"Error processing image: {str(e)}"
        }

def image_to_base64(image):
    _, buffer = cv2.imencode('.jpg', (image * 255).astype(np.uint8))
    return base64.b64encode(buffer).decode('utf-8')