export const getAllUsers = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: "Show all users",
	});
};
