import ApiError from "../exceptions/ApiError.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

class CommentService {
	async getCommentsOnPost(postId) {
		const filter = { post: postId };
		const comments = await Comment.find(filter).sort({ createdAt: -1 }).populate('author', 'fullName avatarUrl').exec();

		return comments;
	}

	async create(content, postId, userId, parentId = null) {
		const filter = { _id: postId };

		const doc = {
			content,
			post: postId,
			parent: parentId,
			author: userId
		};

		const newComment = await Comment.create(doc);

		if (parentId) {
			doc.parent = parentId;
			await Comment.findOneAndUpdate({ _id: parentId }, {
				$inc: { replies_count: 1 },
				$push: { replies: { _id: newComment._id } }
			});
		}

		const comment = await Comment.findOne({ _id: newComment._id }).populate("author", "avatarUrl fullName").exec();
		await Post.findOneAndUpdate(filter, { $inc: { responds_count: 1 } });

		return comment;
	}

	async remove(commentId, postId) {
		const filter = { _id: commentId };
		const postFilter = { _id: postId };
		const comment = await Comment.findOne(filter);

		if (!comment) {
			throw ApiError.BadRequest('Comment not found');
		}

		if (comment.parent) {
			await Comment.updateOne({ _id: comment.parent }, {
				$inc: { replies_count: -1 },
				$pull: { replies: { _id: comment._id } }
			});
		}

		await Comment.deleteOne(filter);
		await Post.findOneAndUpdate(postFilter, { $inc: { responds_count: -1 } });

		for (const replyId of comment.replies) {
			await this.remove(replyId._id.toString(), postId);
		}
	}

	async update(content, commentId, postId, userId) {
		const filter = { _id: commentId };
		const comment = await Comment.findOne(filter).populate('author', '_id').exec();

		if (!comment) {
			throw ApiError.BadRequest('Comment not found');
		}

		if (comment.author._id.toString() !== userId) {
			throw ApiError.UnathorizedError();
		}

		const doc = {
			content,
			post: postId,
			author: userId
		}

		await Comment.updateOne(filter, doc)
	}

	async addLike(commentId, userId) {
		const filter = { _id: commentId };
		const update = {
			$push: { likes: { user: userId } },
			$inc: { likes_count: 1 }
		}

		const comment = await Comment.findOne(filter);
		const likedByUser = comment.likes.some((like) => like.user.toString() === userId);

		if (!likedByUser) {
			await Comment.findOneAndUpdate(filter, update, { new: true })
		}
	}

	async removeLike(commentId, userId) {
		const filter = { _id: commentId };
		const update = {
			$pull: { likes: { user: userId } },
			$inc: { likes_count: -1 }
		}

		const comment = await Comment.findOne(filter);
		const likedByUser = comment.likes.some((like) => like.user.toString() === userId);

		if (likedByUser) {
			await Comment.findOneAndUpdate(filter, update, { new: true })
		}
	}
}

export default new CommentService();