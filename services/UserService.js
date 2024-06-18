import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import User from "../models/User.js";
import ApiError from '../exceptions/ApiError.js'
import UserDto from "../dtos/UserDto.js";
import TokenService from "./TokenService.js";
import MailService from './MailService.js';

class UserService {
	async registration(username, fullName, email, password) {
		const candidateWithUsername = await User.findOne({ username });
		if (candidateWithUsername) {
			throw ApiError.BadRequest("This username isn't available");
		}

		const candidateWithEmail = await User.findOne({ email });
		if (candidateWithEmail) {
			throw ApiError.BadRequest("This email is already registered");
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		const activationLink = uuidv4(); // 26775104-d007-4e05-9667-24cc3238b368 (example link)

		const doc = new User({
			username,
			fullName,
			email,
			passwordHash: hash,
			activationLink,
		});
		const user = await doc.save();
		await MailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`);

		const userDto = new UserDto(user); // username, fullName, email, isActivated, id
		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveTokens(userDto.id, tokens.refreshToken);

		return { ...tokens, user: userDto }
	}

	async checkUsernameAvailability(username) {
		const candidate = await User.findOne({ username });
		if (candidate) {
			throw ApiError.BadRequest("This username isn't available");
		}

		return true;
	}

	async activate(activationLink) {
		const user = await User.findOne({ activationLink });
		if (!user) {
			throw ApiError.BadRequest('Incorrect activation link');
		}

		await User.updateOne({ activationLink }, { isActivated: true });
	}

	async login(username, password) {
		const user = await User.findOne({ username });

		if (!user) {
			throw ApiError.BadRequest('Wrong username or password');
		}

		const isValidPass = await bcrypt.compare(password, user.passwordHash);

		if (!isValidPass) {
			throw ApiError.BadRequest('Wrong username or password');
		}

		const userDto = new UserDto(user);
		const tokens = TokenService.generateTokens({ ...userDto });

		await TokenService.saveTokens(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto
		}
	}

	async logout(refreshToken) {
		const token = await TokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnathorizedError();
		}

		const userData = TokenService.validateRefreshToken(refreshToken);
		const tokenFromDB = await TokenService.findToken(refreshToken);

		if (!userData && !tokenFromDB) {
			throw ApiError.UnathorizedError();
		}

		const user = await User.findById(userData.id);
		const userDto = new UserDto(user);
		const tokens = TokenService.generateTokens({ ...userDto });

		await TokenService.saveTokens(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto
		}
	}

	async getProfile(id) {
		const user = await User.findById(id);

		if (!user) {
			throw ApiError.BadRequest('User not found');
		}

		const userDto = new UserDto(user);

		return {
			user: userDto
		};
	}

	async updateProfile(userId, username, fullName, email, bio = null, avatarUrl = null) {
		const filter = { _id: userId };
		const user = await User.findOne(filter);

		if (!user) {
			throw ApiError.BadRequest('User not found');
		}

		const activationLink = uuidv4(); // 26775104-d007-4e05-9667-24cc3238b368 (example link)

		if (email !== user.email) {
			await User.updateOne(filter, { isActivated: false, activationLink });
			await MailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`);
		}

		const doc = {
			username,
			fullName,
			email,
			bio,
			avatarUrl,
		};

		const updatedUser = await User.findOneAndUpdate(filter, doc, { upsert: true, new: true });
		const userDto = new UserDto(updatedUser); // username, fullName, email, isActivated, id

		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveTokens(userDto.id, tokens.refreshToken);

		return { ...tokens, user: userDto }
	}

	async changePassword(userId, oldPassword, newPassword) {
		const filter = { _id: userId };
		const user = await User.findOne(filter);

		if (!user) {
			throw ApiError.BadRequest('User not found');
		}

		const isValidPass = await bcrypt.compare(oldPassword, user.passwordHash);

		if (!isValidPass) {
			throw ApiError.BadRequest('Wrong password');
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newPassword, salt);

		user.passwordHash = hash;
		user.save();
	}
}

export default new UserService();