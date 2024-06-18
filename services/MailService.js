import nodemailer from 'nodemailer';

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD
			}
		});
	}

	async sendActivationMail(email, link) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to: email,
			subject: `Activate your ${email} email address`,
			text: '',
			html:
				`
					<div>
						<h1>To activate your ${email} email address, follow link below</h1>
						<a href='${link}'>${link}</a>
					</div>
			`
		});
	}
}

export default new MailService();