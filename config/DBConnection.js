const mySQLDB = require('./DBConfig');
const User = require('../models/User');
const CouponRedemption = require('../models/CouponRedemption');
const UserCouponInfo = require('../models/UserCouponInfo');
const Coupon = require('../models/Coupon')
const Delivery = require('../models/Delivery')
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Blog = require('../models/Category');
const Cart = require('../models/cart');
const Item = require('../models/item');
const Order = require('../models/order');
const Invoice = require('../models/Invoice');
const Wishlist = require('../models/Wishlist');
const Rating = require('../models/Rating');
const Logs = require('../models/Logs');




// If drop is true, all exis    ting tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
            /*
            Defines the relationship where a user has many videos.
            The primary key from user will be a foreign key in video.
            // */
            // User.hasMany(Coupon)
            // Coupon.belongsTo(User)
           Product.belongsTo(Brand);
           Brand.hasMany(Product);
           Product.belongsTo(Category);
           Category.hasMany(Product);
           User.hasMany(Cart)
           Wishlist.belongsTo(User);
           User.hasMany(Wishlist);
           User.hasMany(Logs);
           Logs.belongsTo(User);
           Wishlist.belongsTo(Product);
           User.hasMany(Rating)
           Rating.belongsTo(User);
           Product.hasMany(Rating);
           Rating.belongsTo(Product);
           User.hasMany(Delivery);
           Cart.belongsTo(User, {foreignKey:{allowNull: true}});
           Cart.hasMany(Item);
           Item.belongsTo(Cart);
            Item.belongsTo(Product);
            Invoice.belongsTo(Order);
            Invoice.belongsTo(Cart);
            Order.hasMany(Invoice);
            Order.belongsTo(User);
            User.hasMany(Order);
            Invoice.belongsTo(Product)
            // Order.hasOne(Cart)
            // Cart.belongsTo(Order)
            mySQLDB.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
        
        
};

module.exports = { setUpDB };