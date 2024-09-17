import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import router from './router/router.js';
import error from './middlewares/error.js';

const app = express();
export const allowedOrigins = [process.env.CLIENT_URL, process.env.LOCAL_CLIENT_URL]

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	credentials: true,
	origin: (origin, callback) => {
		if (allowedOrigins.includes(origin) || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	}
}));
app.use(router);
app.use('/uploads', express.static('uploads'));
app.use('/uploads/avatars', express.static('uploads/avatars'));
app.use(error);

const start = async () => {
	try {
		await mongoose
			.connect(process.env.DB_URL)
			.then(() => {
				console.log('DB connected');
			})
			.catch((err) => {
				console.log('DB error', err);
			});
		app.listen(process.env.PORT, () => {
			console.log(`Server works on port ${process.env.PORT}`);
		});
	} catch (err) {
		console.log(err)
	}
};

start();