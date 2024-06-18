export default class ApiError extends Error {
	status;
	errors;

	constructor(status, message, errors = []) {
		super(message);
		this.status = status;
		this.errors = errors;
	}

	static UnathorizedError() {
		return new ApiError(401, "The user isn't authored");
	}

	static BadRequest(message, errors = []) {
		return new ApiError(400, message, errors);
	}
}