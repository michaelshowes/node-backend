import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import isAdmin from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/welcome', authMiddleware, isAdmin, (req, res) => {
	res.status(200).json({
		message: 'Welcome to the admin page'
	});
});

export default router;
