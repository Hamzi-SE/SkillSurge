import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
	const parser = new DataUriParser();
	const extName = path.extname(file.originalname).toString(); // path.extname(Gold Plated Beretta.jpg) -> .jpg,

	return parser.format(extName, file.buffer);
};

export default getDataUri;

// Sample file

// {
//   fieldname: 'file',
//   originalname: 'Gold Plated Beretta.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 60 00 60 00 00 ff e1 2c 1e 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 06 00 0b 00 02 00 00 00 26 00 00 ... 147612 more bytes>,
//   size: 147662
// }
