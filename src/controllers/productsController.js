const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = require('../utils/toThousand');
const finalPrice = require('../utils/finalPrice');
const checkId = require ('../utils/checkId');
const { resourceUsage } = require('process');
const { name } = require('ejs');

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products',{
			products,
			finalPrice,
			toThousand,	
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const id = parseInt(req.params.id,10)
		if (checkId(id,products)){
		   let product = products.find(product => product.id === id)
		   return res.render('detail',{
			product,
			finalPrice,
			toThousand
		    })
		}else{
			res.redirect('/')
		}
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render ('product-create-form')	
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const {name,price,discount,category,description} = req.body;
		let product = {
			id : (products[products.length-1].id + 1),
			name,
			price : +price,
			discount : +discount,
			category,
			description,
			image : 'default-image.png',
		}
		products.push(product);
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null,2),'utf-8')
		return res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		let product = products.find(product => product.id === +req.params.id)
		return res.render('product-edit-form',{
			product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const {name,price,description,discount,category} = req.body;

		products.forEach(product => {
		if (product.id === +req.params.id){
			product.id = +req.params.id;
			product.name = name;
			product.description = description;
			product.price = +price;
			product.discount = +discount;
			product.category = category;
			product.image = product.image;
		}
	});
	fs.writeFileSync(productsFilePath,JSON.stringify(products,null,2),'utf-8');
	return res.redirect('/products/detail/'+req.params.id)
	
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products = products.filter(product => product.id !== +req.params.id);
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null,2),'utf-8');
		return res.redirect('/products/detail/'+req.params.id)
	}
};

module.exports = controller;