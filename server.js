import './config/env.config.js';
import express from 'express';
import connectDB from './db/db.js';
import authRoutes from './routes/auth.routes.js';
import homeRoutes from './routes/home.routes.js';
import adminRoutes from './routes/admin.routes.js';
import imageRoutes from './routes/image.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// middleware
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', imageRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
