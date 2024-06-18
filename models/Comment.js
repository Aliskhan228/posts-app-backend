import mongoose from "mongoose";

const Comment = mongoose.Schema(
	{
		content: {
			type: Object,
			required: true
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			required: true
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
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
		replies_count: {
			type: Number,
			default: 0
		},
		replies: [{
			_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			}
		}]
	},
	{
		timestamps: true
	}
);

export default mongoose.model('Comment', Comment);