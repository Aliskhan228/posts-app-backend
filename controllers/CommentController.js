import CommentService from '../services/CommentService.js';

export const getCommentsOnPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const comments = await CommentService.getCommentsOnPost(postId);

		res.json(comments);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get comments',
		})
	}
};

export const create = async (req, res) => {
	try {
		const userId = req.userId;
		const postId = req.params.id;
		const parentId = req.body.parentId;
		const content = req.body.content;

		const comment = await CommentService.create(content, postId, userId, parentId);

		res.json(comment)
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to create comment',
		})
	}
};

export const remove = async (req, res) => {
	try {
		const commentId = req.params.commentId;
		const postId = req.params.id;
		await CommentService.remove(commentId, postId);

		res.json({
			message: 'Comment was successfully deleted',
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to delete comment',
		})
	}
};

export const update = async (req, res) => {
	try {
		const commentId = req.params.commentId;
		const postId = req.params.id;
		const userId = req.userId;
		const content = req.body.content;

		await CommentService.update(content, commentId, postId, userId);

		res.json({
			message: 'Comment was successfully updated',
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to update comment',
		})
	}
}

export const addLike = async (req, res) => {
	try {
		const userId = req.userId;
		const commentId = req.params.commentId;
		console.log("comment id", commentId)

		await CommentService.addLike(commentId, userId);

		res.json({
			message: 'Comment was successfully liked',
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to like comment',
		})
	}
}

export const removeLike = async (req, res) => {
	try {
		const userId = req.userId;
		const commentId = req.params.commentId;

		await CommentService.removeLike(commentId, userId);

		res.json({
			message: 'Comment was successfully liked',
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to like comment',
		})
	}
}