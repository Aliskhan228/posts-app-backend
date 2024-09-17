import Router from "express";
import multer from 'multer';

import { default as handleValidationErrors } from '../middlewares/handleValidationErrors.js';
import { default as checkAuth } from '../middlewares/checkAuth.js';
import { commentCreateValidation, loginValidation, passwordChangeValidation, passwordValidation, postCreateValidation, registerValidation } from '../validations/validations.js';
import * as UserController from '../controllers/UserController.js';
import * as PostController from '../controllers/PostController.js';
import * as CommentController from '../controllers/CommentController.js';

const router = new Router();

const storageOfAvatars = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'uploads/avatars');
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	},
});

const storageOfImages = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'uploads');
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	},
});

const uploadAvatar = multer({ storage: storageOfAvatars });
const uploadImage = multer({ storage: storageOfImages });

// auth routes
router.post('/auth/register', registerValidation, passwordValidation, handleValidationErrors, UserController.register);
router.post('/check-username', UserController.checkUsernameAvailability)
router.post('/auth/login', loginValidation, passwordValidation, handleValidationErrors, UserController.login);
router.post('/auth/logout', UserController.logout);
router.get('/auth/activate/:link', UserController.activate);
router.get('/auth/refresh', UserController.refresh);
router.get('/profile', checkAuth, UserController.getProfile);
router.patch('/profile/:id/update', checkAuth, registerValidation, handleValidationErrors, UserController.updateProfile);
router.patch('/profile/:id/change-password', checkAuth, passwordChangeValidation, handleValidationErrors, UserController.changePassword);

// file upload routes
router.post('/profile', uploadAvatar.single('avatar'), (req, res) => {
	res.json({
		avatarUrl: `/uploads/avatars/${req.file.originalname}`,
	})
});
router.post('/upload', uploadImage.single('image'), (req, res) => {
	try {
		res.json({
			"success": 1,
			"file": {
				"url": `${process.env.API_URL}/uploads/${req.file.originalname}`
			}
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			"success": 0,
			"message": "Failed to upload image"
		})
	}
});

// post routes
router.get('/posts', PostController.getPosts);
router.get('/posts/:id', PostController.getOne);
router.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
router.delete('/posts/:id', checkAuth, PostController.remove);
router.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
router.post('/posts/:id/like', checkAuth, PostController.addLike);
router.delete('/posts/:id/like', checkAuth, PostController.removeLike);

// comment routes
router.get('/posts/:id/comments', CommentController.getCommentsOnPost);
router.post('/posts/:id/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
router.delete('/posts/:id/comments/:commentId', checkAuth, CommentController.remove);
router.patch('/posts/:id/comments/:commentId', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.update);
router.post('/posts/:id/comments/:commentId/like', checkAuth, CommentController.addLike);
router.delete('/posts/:id/comments/:commentId/like', checkAuth, CommentController.removeLike);

export default router;