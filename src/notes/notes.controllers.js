const Note = require("./notes.model");
const User = require('../users/users.model');

//Create Notes
exports.createNote = async (req,res,next) =>{
    try {

        const payload = req.decoded
        console.log(payload)
        let body = req.body;
        const userData = await User.findById(payload.userID);
        

        body.user = userData._id;

        const note = new Note(body);
		note
			.save()
			.then(async (notes) => {


				return res.status(200).json({
					success: true,
					result: notes,
				});
			})
			.catch((err) => {
				return res.status(400).json({
					success: false,
					error: err.message,
				});
			});

    } catch (error) {
        console.log(error);
		return res.status(500).json({
			success: false,
			error: error || 'An error occurred',
		});
    }
}

//update Notes
exports.update = async (req, res, next) => {
	try {
	


		const isNote = await Note.findOne({
			_id: req.params.noteID,
		});
		if (!isNote) {
			return res.status(400).json({
				success: false,
				message: 'Note ID Invalid',
			});
		}
		let body = req.body;
		Note.updateOne({ _id: req.params.noteID }, body, { new: true })
			.then((result) => {
				return res.status(200).json({
					success: true,
					message: 'Note Updated',
				});
			})
			.catch((err) => {
				console.log(err);
			});

	} catch (error) {
		console.log(error);
	}
};

// GET ALL NOTES UNDER USER
exports.getAll = async (req, res, next) => {
	try {
		const payload = req.decoded;
		// console.log(payload);

		Note.find({ user: payload.userID, isDeleted: false })
			.sort({ updatedAt: -1 })
			.then((notes) => {
				return res.status(200).json({
					success: true,
					notes: notes,
				});
			})
			.catch((err) => {
				console.log(err);
			});

	} catch (error) {
		console.log(error);
	}
};

//User gets one
exports.getOne = async (req, res, next) => {
	try {
		const payload = req.decoded;
		// console.log(payload);


		Note.findOne({
			_id: req.params.noteID,
			isDeleted: false,
		})
			.populate('user')

			.then((notes) => {
				if (!notes) {
					return res.status(400).json({
						success: false,
						message: 'Note id Invalid or does not exist',
					});
				}
				return res.status(200).json({
					success: true,
					notes: notes,
				});
			})
			.catch((err) => {
				console.log(err);
			});

	} catch (error) {
		console.log(error);
	}
};

exports.delete = async (req, res, next) => {
	try {
		const payload = req.decoded;
		// console.log(payload);

		const isNote = await Note.findOne({
			_id: req.params.noteID,
		});
		if (!isNote) {
			return res.status(400).json({
				success: false,
				message: 'Note id Invalid',
			});
		}
		Note.updateOne({ _id: req.params.noteID }, { isDeleted: true })
			.then((result) => {
				return res.status(200).json({
					success: true,
					message: 'Note Deleted',
				});
			})
			.catch((err) => {
				console.log(err);
			});

	} catch (error) {
		console.log(error);
	}
};