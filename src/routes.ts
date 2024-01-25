import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as imageService from './service';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const imageUrl = await imageService.handleImageUpload(req.file);
    return res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/images', async (_, res: Response) => {
  try {
    const imageUrls = await imageService.getAllImageUrls();
    return res.json({ imageUrls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/images/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join('uploads', filename);
    await imageService.sendOriginalImage(imagePath, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/images/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    await imageService.deleteImage(filename);
    return res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/images/:filename/resize', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const width = String(req.query.width || "");
    const height = String(req.query.height || "");

    const imagePath = path.join('uploads', filename);
    await imageService.sendResizedImage(imagePath, width, height, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
