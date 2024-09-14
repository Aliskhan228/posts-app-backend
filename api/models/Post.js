import mongoose from "mongoose";

const Post = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		content: {
			type: Object,
			required: true
		},
		likes: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
				},
				createdAt: {
					type: Date,
					default: Date.now
				}
			}
		],
		likes_count: {
			type: Number,
			default: 0
		},
		liked_by_user: {
			type: Boolean,
			default: false
		},
		responds_count: {
			type: Number,
			default: 0
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{
		timestamps: true
	}
);

export default mongoose.model('Post', Post);