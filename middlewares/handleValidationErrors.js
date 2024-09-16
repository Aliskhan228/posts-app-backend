import { validationResult } from "express-validator"
import ApiError from "../exceptions/ApiError.js";

export default (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(ApiError.BadRequest('Validation error', errors.array()));
	}

	next();
}