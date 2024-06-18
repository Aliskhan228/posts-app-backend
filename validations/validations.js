import { body } from "express-validator";

export const registerValidation = [
	body('username', 'Username must be between 6 and 14 characters').isLength({ min: 6, max: 14 }),
	body('fullName', 'Username must be between 3 and 50 characters').isLength({ min: 3, max: 50 }),
	body('email', 'Invalid email').isEmail(),
	body('avatarUrl', 'Invalid image url').optional(),
]

export const passwordValidation = [
	body('password', 'The password must contain at least 8 characters, including one number and one letter').isLength({ min: 8 }),
]

export const passwordChangeValidation = [
	body('oldPassword', 'Password must contain at least 6 characters').isLength({ min: 6 }),
	body('newPassword', 'Password must contain at least 6 characters').isLength({ min: 6 }),
]

export const loginValidation = [
	body('username', 'The username must be at least 3 characters').isLength({ min: 3 }),
]

export const postCreateValidation = [
	body('title', 'Enter post title').isLength({ min: 3 }).isString(),
	body('content.blocks', 'Enter post content').isLength({ min: 1 }),
]

export const commentCreateValidation = [
	body('content.blocks', 'Content cannot be empty').isArray({ min: 1 }),
	body('content.blocks.*', 'Content cannot be empty').notEmpty()
]