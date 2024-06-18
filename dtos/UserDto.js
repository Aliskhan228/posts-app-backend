export default class UserDto {
	username;
	fullName;
	email;
	bio = null;
	avatarUrl = null;
	isActivated;
	id;

	constructor(model) {
		this.username = model.username;
		this.fullName = model.fullName;
		this.email = model.email;
		this.bio = model?.bio;
		this.avatarUrl = model?.avatarUrl;
		this.isActivated = model.isActivated;
		this.id = model._id;
	}
}