import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, message) => {
	const transporter = createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	const mailOptions = {
		from: process.env.SMTP_FROM,
		to,
		subject,
		html: message,
	};

	await transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		}
	});
};
