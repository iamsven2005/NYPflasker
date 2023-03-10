const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
// Create videos table in MySQL Database
const Product = db.define('product',
    {
        product_name: { type: Sequelize.STRING },
        product_price: { type: Sequelize.DECIMAL(5,2) },
        discount: { type: Sequelize.DECIMAL(5,2) },
        stock: { type: Sequelize.INTEGER },
        desc: { type: Sequelize.STRING(500) },
        image: { type: Sequelize.STRING },
        cost: { type: Sequelize.DECIMAL(5,2) },
    });
module.exports = Product;