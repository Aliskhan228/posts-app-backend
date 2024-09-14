import ApiError from "../exceptions/ApiError.js";
import TokenService from "../services/TokenService.js";

export default (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (!authorization) {
			console.log("headers", req.headers)
			return next(ApiError.UnathorizedError());
		}

		const accessToken = authorization.split(" ")[1];
		if (!accessToken) {
			return next(ApiError.UnathorizedError());
		}

		const userData = TokenService.validateAccessToken(accessToken);
		if (!userData) {
			return next(ApiError.UnathorizedError());
		}

		req.userId = userData.id;
		next();
	} catch (err) {
		return next(ApiError.UnathorizedError());
	}
}