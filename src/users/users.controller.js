const User = require('./users.model');
const jwt = require("jsonwebtoken")


// Adding a user Account
exports.create = async (req, res, next) => {
	try {
		const userData = req.body;

		const isuser = await User.findOne({
			email: userData.email,
		});
		if (isuser) {
			return res.status(201).json({
				success: false,
				message: 'user Account exist already',
				
			});
		}
    
		const newuser = new User(userData);

		await newuser.save();

		// Email Send
		await Email.NewUser(newuser.email,newuser.name.first)

		return res.status(201).json({
			success: true,
			message: 'user Account Created',
			newuser,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: error,
		});
	}
};

// Login user
exports.login = async (req, res, next) => {
	try {
		const body = req.body;
		//Finding an existing user
		let user = await User.findOne({
			email: body.email,
			isActive: true,
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'user not Found/ Unapproved/ Inactive',
			});
		}

				// Create a token
				const payload = {
					userID: user._id,
					userEmail: user.email,
					phone: user.phone,
					role:'User'
					
				};
				const options = {
					expiresIn: process.env.JWT_EXPIRES_IN,
					issuer: process.env.JWT_ISSUER,				
				};

				const secret = process.env.JWT_SECRET;
				const token = jwt.sign(payload, secret, options);

				return res.status(200).json({
					success: true,
					message: 'Login Successful',
					user: {
						id: user._id,
						name: user.name,
						email: user.email,
						phoneNumber: user.phone,
						token: token,
					},
				});

	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error,
		});
	}
};
//Recover Password user
exports.recoverPassword = async (req, res, next) => {
	//finding user
	User.findOne({ email: req.body.email, isActive: true })
		.then((user) => {
			const token = Math.floor(100000 + Math.random() * 900000);
			const expiresAt = Date.now() + 60000 * 20; //20 mins
			User.findOneAndUpdate(
				{ _id: user._id },
				{ $set: { resetPasswordToken: token, resetPasswordExpires: expiresAt } }
			)
				.then((result) => {

					//Email send
					Email.UserRecoverPass(user.email,user.name.first, token)
					res.status(200).json({
						success: true,
						message: `Reset Code Sent to Email: ${user.email}`,
						token,
					});
				})
				.catch((err) => {
					res.status(400).json({
						success: false,
						message: 'Problem Resetting Code',
						error: err.message,
					});
				});
		})
		.catch((err) => {
			res.status(400).json({
				success: false,
				message: "'user is not Found/Deactivated'",
				error: err.message,
			});
		});
};

// ResetPassword
exports.resetPassword = async (req, res) => {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() },
	}).then((user) => {
		if (!user) {
			return res
				.status(401)
				.json({ message: 'Password reset token is invalid or has expired.' });
		}

		//Set the new password
		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		//Save
		user
			.save()
			.then((result) => {
				res.status(200).json({
					success: true,
					message: 'Password reset successful',
					
				});
			})
			.catch((err) => {
				res.status(400).json({
					success: false,
					message: 'Password reset error',
					error: err.message,
				});
			});
	});
};

// Get User Details
exports.getUserDetails = async (req, res, next) => {
	try {
		let userDetails = req.params.userid;
			await User.findOne({
				_id: userDetails,
				isActive:true
			})
				.select('-isActive')
				.select('-password')
				.select('-resetPasswordToken')
				.select('-resetPasswordExpires')
				
				.then((result) => {
				
					return res.status(200).json({
						success: true,
						user: result,
					});
				})
				.catch((err) => {
					return res.status(400).json({
						success: false,
						message: 'Error Occured while finding user',
						error: err.message,
					});
				});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
			error: error.message,
		});
	}
};


//Getting All Users
exports.getAll = async (req, res, next) => {
	try {

			User.find()
				.select('-password')
				.select('-resetPasswordToken')
				.select('-resetPasswordExpires')
				.then((users) => {
					return res.status(200).send({
						success: true,
						users,
					});
				})
				.catch((err) => {
					return res.status(500).send({
						success: false,
						error:
							err.message || 'Some error occurred while retrieving all Users.',
					});
				});
		
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error || 'An error occurred',
		});
	}
};

//Update a User with UserID
exports.update = async (req, res, next) => {
	try {
		const payload = req.decoded;
			const user = await User.findById(payload.userID).select(
				'-password'
			);
			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'user does not exists',
				});
			}

			User.updateOne({ _id: payload.userID }, { $set: req.body })
				.then((user) => {
					return res.status(200).json({
						success: true,
						message: 'user successfully updated',
					});
				})
				.catch((err) => {
					return res.status(500).json({
						success: false,
						message: 'An error occurred when updating user',
						error: err || 'An error occurred when updating user',
					});
				});
		
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'An error occurred when updating user',
			error: error || 'An error occurred when updating user',
		});
	}
};


// Delete with the UserID
exports.delete = async (req, res, next) => {
	try {

			const user = await User.findOne({
				_id: req.params.userid,
				isActive: true,
			}).select('-password');

			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'user does not exists',
				});
			}

			User.updateOne(
				{ _id: user._id },
				{
					isActive: false,
				}
			)
				.then((result) => {
					return res.status(200).json({
						success: true,
						message: 'user successfully deleted',
					});
				})
				.catch((err) => {
					console.log(err);
					return res.status(500).json({
						success: false,
						message: 'user delete error',
					});
				});
		
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || 'user delete error',
		});
	}
};

exports.getUsersCount = async (req, res, next) => {
	try {

			User.find().count()
				.select('-password')
				.select('-resetPasswordToken')
				.select('-resetPasswordExpires')
				.select('-name')
				.select('-email')
				.select('-phoneNumber')
				.select('-isActive')
				.then((users) => {
					return res.status(200).send({
						success: true,
						users,
					});
				})
				.catch((err) => {
					return res.status(500).send({
						success: false,
						error:
							err.message || 'Some error occurred while retrieving all Users.',
					});
				});
		
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error || 'An error occurred',
		});
	}
};
