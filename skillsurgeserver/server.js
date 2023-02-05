import app from "./app.js";
import connectDatabase from "./config/database.js";

// MongoDB connection
connectDatabase();

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
