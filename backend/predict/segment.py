import numpy as np

def segment_stone(image_array):
    # Placeholder: Replace with actual segmentation model
    # Returns segmented image and stone details
    segmented_image = image_array  # Dummy return
    stone_info = {
        "size": np.random.uniform(2, 15),  # Size in mm
        "shape": np.random.choice(["Round", "Irregular"]),
        "location": np.random.choice(["Left Kidney", "Right Kidney"]),
        "position": np.random.choice(["Upper Pole", "Lower Pole"])
    }
    return segmented_image, stone_info