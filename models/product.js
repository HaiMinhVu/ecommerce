const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 64
		},
		description: {
			type: String,
			trim: true,
			required: true,
			maxlength: 255
		},
		price: {
			type: Number,
			trim: true,
			required: true,
		},
		category: {
			type: ObjectId,
			ref: 'Category',
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		image: {
			data: Buffer,
			contentType: String
		},
		shipping: {
			type: Boolean,
			required: false
		}
	}, 
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);