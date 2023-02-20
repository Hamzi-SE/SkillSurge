import mongoose from "mongoose";

const schema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please enter course title"],
			trim: true,
			minLength: [4, "Course title must be at least 4 characters"],
			maxLength: [80, "Course title cannot exceed 80 characters"],
		},
		description: {
			type: String,
			required: [true, "Please enter course description"],
			trim: true,
			minLength: [20, "Course description must be at least 20 characters"],
		},
		lectures: [
			{
				title: {
					type: String,
					required: [true, "Please enter lecture title"],
					trim: true,
					minLength: [4, "Lecture title must be at least 4 characters"],
					maxLength: [80, "Lecture title cannot exceed 80 characters"],
				},
				description: {
					type: String,
					required: [true, "Please enter lecture description"],
					trim: true,
					minLength: [20, "Lecture description must be at least 20 characters"],
				},
				video: {
					public_id: {
						type: String,
						required: true,
					},
					url: {
						type: String,
						required: true,
					},
				},
			},
		],
		poster: {
			public_id: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
		},
		views: {
			type: Number,
			default: 0,
		},
		numOfVideos: {
			type: Number,
			default: 0,
		},
		category: {
			type: String,
			required: [true, "Please select a category for this course"],
		},
		createdBy: {
			type: String,
			required: [true, "Please enter course creator's name"],
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Course", schema);
