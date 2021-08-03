const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = require('../utils/toThousand');
const finalPrice = require('../utils/finalPrice');

const controller = {
	index: (req, res) => {
		let visited =products.filter(product => product.category === "visited");
		let inSale = products.filter(product => product.category === "in-sale")
		return res.render('index',{
			visited,
			inSale,
			toThousand,
			finalPrice
		})
	},
	search: (req, res) => {
		if(req.query.keywords.trim() != ""){
		let results = products.filter(product => product.name.toLowerCase().includes(req.query.keywords.toLowerCase().trim()));
		return res.render('results',{
			results,
			toThousand,
			finalPrice,
			keywords : req.query.keywords
		})
	}else{
		res.redirect('/')
	}
},
};

module.exports = controller;
