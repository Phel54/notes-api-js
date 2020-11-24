const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.validateToken = async (req, res, next) => {
	const authorizationHeader = req.headers.authorization;
	const authorizationType = req.headers.authtype;
	let result;
	// console.log(authorizationHeader);
	// console.log(authorizationType);

	// if (authorizationType == 'FREEDOM') {
	// 	try {
	// 		const apiKey = authorizationHeader.split(' ')[1]; // Bearer <token>
	// 		const apiSecret = authorizationHeader.split(' ')[2]; // Bearer <token>
	// 		// console.log(apiSecret);
	// 		const merchantData = await Merchant.findOne({
	// 			'API.key': apiKey,
	// 			'API.secret': apiSecret,
	// 		}).select('API.token');
	// 		// console.log(merchantData);
	// 		if (!merchantData) {
	// 			//Send Email to Merchant
	// 			return res.status(300).json({
	// 				success: false,
	// 				error: `Authentication error; Token rejected.`,
	// 			});
	// 		}

	// 		const token = merchantData.API.token;
	// 		// console.log(token);
	// 		const options = {
	// 			expiresIn: process.env.JWT_EXPIRES_IN,
	// 			issuer: process.env.JWT_ISSUER,
	// 			subject: process.env.JWT_SUBJECT,
	// 			audience: process.env.JWT_AUDIENCE,
	// 		};

	// 		try {
	// 			// verify makes sure that the token hasn't expired and has been issued by us
	// 			result = jwt.verify(token, process.env.JWT_SECRET, options);

	// 			// Let's pass back the decoded token to the request object
	// 			req.decoded = result;

	// 			// We call next to pass execution to the subsequent middleware
	// 			return next();
	// 		} catch (err) {
	// 			// Throw an error just in case anything goes wrong with verification
	// 			return res.status(500).json(err);
	// 		}
	// 	} catch (error) {
	// 		return res.status(500).json(error);
	// 	}
	// }

	if (authorizationHeader) {
		const token = authorizationHeader.split(' ')[1]; // Bearer <token>
		const options = {
			expiresIn: process.env.JWT_EXPIRES_IN,
			issuer: process.env.JWT_ISSUER,			
		};
		// console.log(token);
		try {
			// verify makes sure that the token hasn't expired and has been issued by us
			result = jwt.verify(token, process.env.JWT_SECRET, options);

			// if (result.authType == 'API' && result.accountType == 'MERCHANT') {
			// 	console.log('..api request...');
			// 	const merchantData = await Merchant.findById(result.merchantID).select(
			// 		'APIKey'
			// 	);
			// 	// console.log(merchantData);
			// 	if (merchantData.APIKey !== token) {
			// 		let message = `An attempt was issued from your account with invalid credentials - kindly take note`;
			// 		console.log(message);
			// 		// req.decoded = result;
			// 		return res.status(300).json({
			// 			success: false,
			// 			error: `Authentication error; Token rejected.`,
			// 		});
			// 	}
			// }

			// Let's pass back the decoded token to the request object
			req.decoded = result;

			// We call next to pass execution to the subsequent middleware
			return next();
		} catch (err) {
			// Throw an error just in case anything goes wrong with verification
			return res.status(500).json(err);
		}
		// return;
	}
	return res.status(401).json({
		success: false,
		errors: `Authentication error; Token required.`,
	});
};
