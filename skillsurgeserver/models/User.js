import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter your name"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Please enter your email"],
			unique: true,
			validate: validator.isEmail,
		},
		password: {
			type: String,
			required: [true, "Please enter your password"],
			minLength: [6, "Password must be at least 6 characters"],
			select: false,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		subscription: {
			id: String,
			status: String,
		},
		avatar: {
			public_id: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
		},
		playlist: [
			{
				course: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Course",
				},
				poster: String,
			},
		],

		ResetPasswordToken: String,
		ResetPasswordExpire: String,
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("User", schema);
