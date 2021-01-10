const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
	let form = new formidable.IncomingForm();

	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if(err){
			return res.status(400).json({
				error: 'Image could not be uploaded'
			});
		}

		const { name, description, price, category, quantity, shipping } = fields
		if(!name || !description || !price || !category || !quantity){
			return res.status(400).json({
				error: 'All fields are required'
			});
		}

		let product = new Product(fields);

		if(files.image){
			if(files.image.size > 1000000){
				return res.status(400).json({
					error: 'Image should be less than 1Mb'
				});
			}
			product.image.data = fs.readFileSync(files.image.path);
			product.image.contentType = files.image.type;
		}

		product.save((err, product) => {
			if(err || !product){
				return res.status(400).json({
					error: errorHandler(err)
				})
			}
			res.json(product);
		});
	});
}

exports.productById = (req, res, next, id) => {
	Product.findById(id).exec((err, product) => {
		if(err || !product){
			return res.status(400).json({
				error: "Product not found"
			});
		}
		console.log(product)
		req.product = product;
		next();
	});
}

exports.read = (req, res) => {
	req.product.image = undefined;
	return res.json(req.product);
}

exports.remove = (req, res) => {
	let product = req.product
	product.remove((err, deletedProduct) => {
		if(err){
			return res.status(400).json({
				error: errorHandler(err)
			});
		}
		res.json({
			"message": "Product deleted"
		})
	})
}

exports.update = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if(err){
			return res.status(400).json({
				error: 'Image could not be uploaded'
			});
		}

		const { name, description, price, category, quantity, shipping } = fields
		if(!name || !description || !price || !category || !quantity){
			return res.status(400).json({
				error: 'All fields are required'
			});
		}

		let product = req.product;
		product = _.extend(product, fields);

		// 1Mb = 1000000
		if(files.image){
			if(files.image.size > 1000000){
				return res.status(400).json({
					error: 'Image should be less than 1Mb'
				});
			}
			product.image.data = fs.readFileSync(files.image.path);
			product.image.contentType = files.image.type;
		}

		product.save((err, product) => {
			if(err || !product){
				return res.status(400).json({
					error: errorHandler(err)
				})
			}
			res.json(product);
		});
	});
}

exports.list = (req, res) => {
	let order = req.query.order ? req.query.order : 'asc';
	let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
	let limit = req.query.limit ? parseInt(req.query.limit) : 6;

	Product.find()
			.select("-image")
			.populate('category')
			.sort([[sortBy, order]])
			.limit(limit)
			.exec((err, products) => {
				if(err){
					return res.status(400).json({
						error: 'Product not found'
					});
				}
				res.send(products);
			})
}

exports.relatedList = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 4;
	Product.find({_id: {$ne: req.product}, category: req.product.category})
			.limit(limit)
			.populate('category', '_id name')
			.exec((err, products) => {
				if(err){
					return res.status(400).json({
						error: 'Product not found'
					});
				}
				res.send(products);
			})
}

exports.listCategory = (req, res) => {
	Product.distinct("category", {}, (err, categories) => {
		if(err){
			return res.status(400).json({
				error: 'Categories not found'
			});
		}
		res.send(categories);
	})
}
