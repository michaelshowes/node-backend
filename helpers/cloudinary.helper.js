import cloudinary from '../config/cloudinary.config.js';

export const uploadToCloudinary = async (filePath) => {
	try {
		const res = await cloudinary.uploader.upload(filePath);

		return {
			url: res.secure_url,
			publicId: res.public_id
		};
	} catch (e) {
		console.log(e);
		throw new Error('Failed to upload image to Cloudinary');
	}
};
