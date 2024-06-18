import mongoose from "mongoose";

const User = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true
		},
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		isActivated: {
			type: Boolean,
			default: false
		},
		activationLink: String,
		bio: {
			type: String,
			default: null
		},
		avatarUrl: {
			type: String,
			default: null
		},
	},
	{
		timestamps: true
	}
);

export default mongoose.model('User', User);