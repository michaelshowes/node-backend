import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `${__dirname}/../uploads`);
	},
	filename: (req, file, cb) => {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	}
});

const checkFileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('Only image files are allowed'), false);
	}
};

const uploadMiddleware = multer({
	storage,
	fileFilter: checkFileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024 // 5MB
	}
});

export default uploadMiddleware;
