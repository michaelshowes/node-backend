const isAdmin = (req, res, next) => {
	if (req.userInfo.role !== 'admin') {
		return res.status(403).json({
			message: 'Access denied',
			success: false
		});
	}

	next();
};

export default isAdmin;
