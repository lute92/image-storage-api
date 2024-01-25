import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function handleImageUpload(file: Express.Multer.File | undefined): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  const imageUrl = `/uploads/${file.filename}`;
  return imageUrl;
}

export async function getAllImageUrls(): Promise<string[]> {
  const imageFiles = fs.readdirSync('uploads');
  const imageUrls = imageFiles.map((filename) => `/uploads/${filename}`);
  return imageUrls;
}

export async function sendOriginalImage(imagePath: string, res: any): Promise<void> {
  if (!fs.existsSync(imagePath)) {
    throw new Error('Image not found');
  }

  res.sendFile(imagePath);
}

export async function deleteImage(filename: string): Promise<void> {
  const imagePath = path.join('uploads', filename);

  if (!fs.existsSync(imagePath)) {
    throw new Error('Image not found');
  }

  fs.unlinkSync(imagePath);
}

export async function sendResizedImage(imagePath: string, width: string | undefined, height: string | undefined, res: any): Promise<void> {
  if (!fs.existsSync(imagePath)) {
    throw new Error('Image not found');
  }

  const resizedImage = await sharp(imagePath)
    .resize(Number(width), Number(height))
    .toBuffer();

  res.type('image/jpeg');
  res.send(resizedImage);
}
