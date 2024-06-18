import ApiError from "../exceptions/ApiError.js";
import Post from "../models/Post.js";

class PostService {
	async getAll(query) {
		const posts = await Post
			.find()
			.sort({ createdAt: query.sortBy === "-created_at" ? -1 : 1 })
			.populate('author', 'fullName avatarUrl')
			.exec();

		return posts;
	}

	async getOne(id) {
		const filter = { _id: id };
		const post = await Post.findOne(filter).populate('author likes.user', 'fullName avatarUrl').exec();

		if (!post) {
			throw ApiError.BadRequest('Post not found');
		}

		return post;
	}

	async getByQuery(query) {
		const regex = new RegExp(query.title, 'i');
		const filter = {
			title: { $regex: regex }
		};

		const posts = await Post
			.find(filter)
			.sort({ createdAt: query.sortBy === "-created_at" ? -1 : 1 })
			.populate('author', 'fullName avatarUrl')
			.exec();

		return posts;
	}

	async create(title, content, userId) {
		const doc = new Post({
			title,
			content,
			author: userId
		});

		const post = await doc.save();

		return post;
	}

	async remove(postId, userId) {
		const filter = { _id: postId };
		const post = await Post.findOne(filter).populate('author', '_id').exec();

		if (!post) {
			throw ApiError.BadRequest('Post not found');
		}

		if (post.author._id.toString() !== userId) {
			throw ApiError.UnathorizedError();
		}

		await Post.deleteOne(filter);
	}

	async update(title, content, postId, userId) {
		const filter = { _id: postId };

		const post = await Post.findOne(filter).populate('author', '_id').exec();

		if (!post) {
			throw ApiError.BadRequest('Post not found');
		}

		if (post.author._id.toString() !== userId) {
			throw ApiError.UnathorizedError();
		}

		const doc = {
			title,
			content,
			author: userId
		}

		await Post.updateOne(filter, doc);
	}

	async addLike(postId, userId) {
		const filter = { _id: postId };
		const update = {
			$push: { likes: { user: userId } },
			$inc: { likes_count: 1 }
		}

		const post = await Post.findOne(filter);
		const likedByUser = post.likes.some((like) => like.user.toString() === userId);

		if (!likedByUser) {
			await Post.findOneAndUpdate(filter, update, { new: true })
		}
	}

	async removeLike(postId, userId) {
		const filter = { _id: postId };
		const update = {
			$pull: { likes: { user: userId } },
			$inc: { likes_count: -1 }
		}

		const post = await Post.findOne(filter);
		const likedByUser = post.likes.some((like) => like.user.toString() === userId);

		if (likedByUser) {
			await Post.findOneAndUpdate(filter, update, { new: true })
		}
	}
}

export default new PostService();