import { createCanvas, loadImage } from 'canvas';

export default async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await loadImage(imageSrc);
  const canvas = createCanvas(croppedAreaPixels.width, croppedAreaPixels.height);
  const ctx = canvas.getContext('2d');

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height,
    0, 0, croppedAreaPixels.width, croppedAreaPixels.height
  );

  return canvas.toDataURL('image/jpeg');
}
