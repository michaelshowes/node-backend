import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
	try {
		const { username, email, password, role } = req.body;

		// check if user already exists
		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res.status(400).json({
				message: 'User already exists',
				success: false
			});
		}

		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// create user
		const newUser = await User.create({
			username,
			email,
			password: hashedPassword,
			role: role || 'user'
		});

		if (newUser) {
			res.status(201).json({
				message: 'User created successfully',
				success: true
			});
		} else {
			res.status(400).json({
				message: 'User creation failed',
				success: false,
				error: 'User creation failed'
			});
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'Internal server error',
			success: false,
			error: e.message
		});
	}
};

export const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;

		// check if user exists
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({
				message: 'User not found',
				success: false
			});
		}

		// check if password is correct
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({
				message: 'Invalid password',
				success: false
			});
		}

		// generate token
		const token = jwt.sign(
			{
				userId: user._id,
				username: user.username,
				role: user.role
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: '1hr' }
		);

		res.status(200).json({
			message: 'Login successful',
			success: true,
			token
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'Internal server error',
			success: false,
			error: e.message
		});
	}
};

export const changePassword = async (req, res) => {
	try {
		const userId = req.userInfo.userId;
		const { oldPassword, newPassword } = req.body;
		const user = await User.findById(userId);

		// check if user exists
		if (!user) {
			return res.status(400).json({
				message: 'User not found',
				success: false
			});
		}

		// check if old password is correct
		const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({
				message: 'Invalid old password',
				success: false
			});
		}

		// hash new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		// update password
		user.password = hashedPassword;
		await user.save();

		res.status(200).json({
			message: 'Password changed successfully',
			success: true
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'Internal server error',
			success: false,
			error: e.message
		});
	}
};
