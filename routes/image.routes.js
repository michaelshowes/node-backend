import express from 'express';
import {
	uploadImage,
	fetchImages,
	deleteImage
} from '../controllers/image.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import uploadMiddleware from '../middleware/upload.middleware.js';

const router = express.Router();

router.post(
	'/',
	authMiddleware,
	adminMiddleware,
	uploadMiddleware.single('image'),
	uploadImage
);
router.get('/', authMiddleware, fetchImages);
router.delete('/:id', authMiddleware, deleteImage);

export default router;

// 69377c0557d66ce32b0090af
