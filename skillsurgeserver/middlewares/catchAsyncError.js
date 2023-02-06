export const catchAsyncError = (passedFunction) => (req, res, next) => {
	Promise.resolve(passedFunction(req, res, next)).catch(next);
};

/* export const catchAsyncError = (passedFunction) => {
/ 	return (req, res, next) => {
/ 		Promise.resolve(passedFunction(req, res, next)).catch(next);
/ 	};
 }; 
*/

// Both are same
