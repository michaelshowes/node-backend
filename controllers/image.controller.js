import Image from '../models/Image.js';
import { uploadToCloudinary } from '../helpers/cloudinary.helper.js';
import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs';

export const uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: 'File is required'
			});
		}

		const { url, publicId } = await uploadToCloudinary(req.file.path);

		const newImage = await Image.create({
			url,
			publicId,
			uploadedBy: req.userInfo.userId
		});

		fs.unlinkSync(req.file.path);

		res.status(201).json({
			success: true,
			message: 'Image uploaded successfully',
			image: newImage
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: e.message
		});
	}
};

export const fetchImages = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 2;
		const skip = (page - 1) * limit;
		const sortBy = req.query.sortBy || 'createdAt';
		const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
		const totalImages = await Image.countDocuments();
		const totalPages = Math.ceil(totalImages / limit);
		const sortObj = {};
		sortObj[sortBy] = sortOrder;
		const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

		if (images) {
			return res.status(200).json({
				success: true,
				currentPage: page,
				totalPages,
				totalImages,
				limit,
				data: images
			});
		} else {
			return res.status(404).json({
				success: false,
				message: 'No images found'
			});
		}
	} catch (e) {
		console.log(e);
	}
};

export const deleteImage = async (req, res) => {
	try {
		const imageId = req.params.id;
		const userId = req.userInfo.userId;
		const image = await Image.findById(imageId);

		// check if image exists
		if (!image) {
			return res.status(404).json({
				success: false,
				message: 'Image not found'
			});
		}

		// check if user is the owner of the image
		if (
			image.uploadedBy.toString() !== userId &&
			req.userInfo.role !== 'admin'
		) {
			return res.status(403).json({
				success: false,
				message:
					'You are not authorized to delete this image as you are not the owner'
			});
		}

		// delete image from cloudinary
		await cloudinary.uploader.destroy(image.publicId);

		// delete image from database
		await image.deleteOne();

		res.status(200).json({
			success: true,
			message: 'Image deleted successfully'
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: e.message
		});
	}
};
