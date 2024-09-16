import PostService from "../services/PostService.js";

export const getPosts = async (req, res, next) => {
	try {
		const query = req.query;
		if (query.title === '') {
			await PostService.getAll(query)
				.then((posts) => res.json(posts))
				.catch((err) => res.status(500).json({ error: err.message }));
		} else {
			await PostService.getByQuery(query)
				.then((posts) => res.json(posts))
				.catch((err) => res.status(500).json({ error: err.message }));
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get posts',
		})
	}
}

export const getOne = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const post = await PostService.getOne(postId);

		res.json(post);
	} catch (err) {
		next(err);
	}
};

export const create = async (req, res) => {
	try {
		const { title, content } = req.body;
		const userId = req.userId;
		const post = await PostService.create(title, content, userId);

		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to create post',
		})
	}
};

export const remove = async (req, res) => {
	try {
		const userId = req.userId;
		const postId = req.params.id;
		await PostService.remove(postId, userId);

		res.json({
			message: 'Post was successfully deleted',
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to delete post',
		})
	}
};

export const update = async (req, res) => {
	try {
		const { title, content } = req.body;
		const userId = req.userId;
		const postId = req.params.id;

		await PostService.update(title, content, postId, userId);

		res.json({
			message: 'Post was successfully updated',
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to update post',
		})
	}
};

export const addLike = async (req, res) => {
	try {
		const userId = req.userId;
		const postId = req.params.id;

		await PostService.addLike(postId, userId);

		res.json({
			message: 'Post was successfully liked',
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to like post',
		})
	}
}

export const removeLike = async (req, res) => {
	try {
		const userId = req.userId;
		const postId = req.params.id;

		await PostService.removeLike(postId, userId);

		res.json({
			message: 'Post was successfully liked',
		})
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to like post',
		})
	}
}