from PIL import Image
import io

def compress_image(image_data, max_size_mb=1, max_dimension=300, quality=85):
    # Convert max_size_mb to bytes
    max_size_bytes = max_size_mb * 1024 * 1024

    # Open the image from bytes
    try:
        image = Image.open(io.BytesIO(image_data))
    except Exception as e:
        raise ValueError(f"Invalid image file: {str(e)}")

    # Convert image to RGB if it has an alpha channel (e.g., PNG)
    if image.mode in ("RGBA", "P"):
        image = image.convert("RGB")

    # Get the original size
    original_size = len(image_data)

    # If the image is already under the max size, return it as-is
    if original_size <= max_size_bytes:
        output = io.BytesIO()
        image.save(output, format="JPEG", quality=quality)
        return output.getvalue()

    # Calculate the scaling factor to resize the image
    width, height = image.size
    if width > height:
        new_width = max_dimension
        new_height = int((max_dimension / width) * height)
    else:
        new_height = max_dimension
        new_width = int((max_dimension / height) * width)

    # Resize the image
    image = image.resize((new_width, new_height), Image.LANCZOS)

    # Save the compressed image to a bytes buffer
    output = io.BytesIO()
    image.save(output, format="JPEG", quality=quality, optimize=True)

    compressed_data = output.getvalue()
    compressed_size = len(compressed_data)

    # If the compressed image is still too large, reduce quality iteratively
    while compressed_size > max_size_bytes and quality > 10:
        quality -= 10
        output = io.BytesIO()
        image.save(output, format="JPEG", quality=quality, optimize=True)
        compressed_data = output.getvalue()
        compressed_size = len(compressed_data)

    return compressed_data