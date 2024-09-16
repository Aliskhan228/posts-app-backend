import UserService from '../services/UserService.js';

export const register = async (req, res, next) => {
	try {
		const { username, fullName, email, password } = req.body;
		const userData = await UserService.registration(username, fullName, email, password);

		return res.json(userData);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: err.message
		})
	}
};

export const checkUsernameAvailability = async (req, res) => {
	try {
		const username = req.body.username;
		const isAvailable = await UserService.checkUsernameAvailability(username);

		return res.json({ isAvailable });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: err.message
		})
	}
};

export const login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const userData = await UserService.login(username, password);

		res.cookie(
			'refreshToken',
			userData.refreshToken,
			{
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',  // Устанавливаем secure только в production
				sameSite: 'None',
			},
		);

		return res.json(userData);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: err.message
		})
	}
};

export const logout = async (req, res, next) => {
	try {
		const { refreshToken } = req.cookies;
		const token = await UserService.logout(refreshToken);

		res.clearCookie('refreshToken');

		return res.json(token);
	} catch (err) {
		next(err);
	}
};

export const activate = async (req, res, next) => {
	try {
		const activationLink = req.params.link;
		await UserService.activate(activationLink);
		return res.redirect(process.env.CLIENT_URL);
	} catch (err) {
		next(err);
	}
};

export const refresh = async (req, res, next) => {
	try {
		const { refreshToken } = req.cookies;
		const userData = await UserService.refresh(refreshToken);

		res.cookie(
			'refreshToken',
			userData.refreshToken,
			{
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',  // Устанавливаем secure только в production
				sameSite: 'None',
			}
		);

		return res.json(userData);
	} catch (err) {
		next(err);
	}
};

export const getProfile = async (req, res, next) => {
	try {
		const user = await UserService.getProfile(req.userId);

		res.json(user);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'No access'
		})
	}
};

export const updateProfile = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const { username, fullName, email, bio, avatarUrl } = req.body;
		const userData = await UserService.updateProfile(userId, username, fullName, email, bio, avatarUrl);

		res.cookie(
			'refreshToken',
			userData.refreshToken,
			{
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',  // Устанавливаем secure только в production
				sameSite: 'None',
			}
		);

		return res.json(userData);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'No access'
		})
	}
};

export const changePassword = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const { oldPassword, newPassword } = req.body;

		await UserService.changePassword(userId, oldPassword, newPassword);

		return res.json({ message: "Your password successfully changed" });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'No access'
		})
	}
};