import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({
			message: 'Unauthorized',
			success: false
		});
	}

	try {
		// decode token
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.userInfo = decodedToken;

		next();
	} catch (e) {
		return res.status(401).json({
			message: `Unauthorized: ${e.message}`,
			success: false
		});
	}
};

export default authMiddleware;
