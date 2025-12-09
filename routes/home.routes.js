import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/welcome', authMiddleware, (req, res) => {
	const { username, userId, role } = req.userInfo;

	res
		.status(200)
		.json({
			message: 'Welcome to the home page',
			user: {
				_id: userId,
				username,
				role
			}
		})
		.send();
});

export default router;
