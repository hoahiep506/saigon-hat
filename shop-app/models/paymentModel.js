const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
	{
		user_id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		note: {
			type: String,
			default: "",
		},
		email: {
			type: String,
			required: true,
		},
		paymentID: {
			type: String,
			required: true,
		},
		address: {
			type: Object,
			required: true,
		},
		cart: {
			type: Array,
			default: [],
		},
		status: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Payments", paymentSchema);
