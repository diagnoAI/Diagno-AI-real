from tensorflow.keras.preprocessing import image
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import cv2
import warnings
import os
warnings.filterwarnings(action="ignore")
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

model = load_model('D://Dataset Preprocess/Diagno AI real/backend/AI models/DIagnoGenix_AI.h5', compile=False)

def prepare_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img_array = np.expand_dims(img, axis=0)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    return img_array

def predict_image(image_path):
    try:
        img_array = prepare_image(image_path)
        prediction = model.predict(img_array)
        class_labels = ['normal', 'stone']
        predicted_class = class_labels[np.argmax(prediction)]
        confidence = np.max(prediction) * 100

        if predicted_class == 'normal':
            return True, f"Stone not detected. Normal kidney (Confidence: {confidence:.2f}%)"
        else:
            return True, f"Stone detected in kidney (Confidence: {confidence:.2f}%)"
    except Exception as e:
        return False, f"Error predicting image: {str(e)}"

def classify_image(image_path):
    success, message = predict_image(image_path)
    return message