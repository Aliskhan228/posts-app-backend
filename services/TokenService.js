import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_ACCESS_SECRET,
			{ expiresIn: '30m' }
		);
		const refreshToken = jwt.sign(
			payload,
			process.env.JWT_REFRESH_SECRET,
			{ expiresIn: '30d' }
		);

		return {
			accessToken,
			refreshToken
		}
	}

	validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
			return userData;
		} catch (err) {
			return null;
		}
	}

	validateRefreshToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
			return userData;
		} catch (err) {
			return null;
		}
	}

	async saveTokens(userId, refreshToken) {
		const tokenData = await Token.findOne({ user: userId });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}

		const doc = new Token({
			user: userId,
			refreshToken
		});
		const token = await doc.save();
		return token;
	}

	async removeToken(refreshToken) {
		const token = await Token.findOneAndDelete({ refreshToken });
		return token;
	}

	async findToken(refreshToken) {
		const token = await Token.findOne({ refreshToken })
		return token;
	}
}

export default new TokenService();