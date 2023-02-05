import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const connectDatabase = () => {
	mongoose
		.connect(process.env.MONGO_URI)
		.then((data) => {
			console.log(`MongoDB connected with ${data.connection.db.databaseName} database`);
		})
		.catch((err) => {
			console.log(`MongoDB connection error: ${err.message || err}`);
		});
};

export default connectDatabase;
