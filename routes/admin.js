const { raw } = require('express');
const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const moment = require('moment');
const CouponRedemption = require('../models/CouponRedemption');

router.get('/', (req, res) => {
	const title = 'Admin';
	// renders views/index.handlebars, passing title as an object

	const metadata = {
		layout: 'admin',
		nav: {
			sidebarActive: 'dashboard'
		}
	}
	res.render('admin/index', metadata)
});


router.get('/addproduct',async (req, res) => {
	var brand = await Brand.findAll({raw: true})
	var category = await Category.findAll({raw: true})
	res.render('admin/addproducts', { brands: brand , category: category , layout: 'admin', nav: { sidebarActive: 'addproduct' } })
});

router.post('/addproduct',async function (req, res) {	
	let { product_name, product_price, discount, stock, desc, image, brandId, categoryId } = req.body;
	try{
		let product = await Product.create({product_name, product_price, discount, stock, desc, image, brandId, categoryId});
		flashMessage(res, 'success', 'Product created successfully.');
		res.redirect('/')
	}
	catch(err){
		console.log(err)
	}

})

router.get('/updateproduct/:id', async (req, res) => {
	var brand = await Brand.findAll({raw: true})
	var category = await Category.findAll({raw: true})
	var product = await Product.findByPk(req.params.id)
	var brand_name = await Brand.findByPk(product.brandId);
	var category_name = await Category.findByPk(product.categoryId)
	res.render('admin/addproducts', { brands: brand, category, product, brand_name ,category_name, layout: 'admin', nav: { sidebarActive:	'addproduct'}})
})

router.post('/updateproduct/:id', async function(req, res) {
	let { product_name, product_price, discount, stock, desc, image, brandId, categoryId } = req.body;
	try{
		Product.update(
			{
				product_name, product_price, discount, stock, desc, image, brandId, categoryId 
			},
			{
				where: { id: req.params.id}
			})
			flashMessage(res, 'success', 'Product updated successfully.')
			res.redirect('/')
	}
	catch(err){
		console.log(err);
	}
})

router.get('/deleteproduct/:id', async function(req, res){
	try{
		let product = await Product.findByPk(req.params.id)
		let result = await Product.destroy({where: { id: product.id}})
		console.log(result +' product deleted')
		res.redirect('/')
	}catch(err){
		console.log(err)
	}
})

router.get('/admincouponcreate', (req, res) => {
	const metadata = {
		layout: 'admin',
		nav: {
			sidebarActive: 'coupon'
		}
	}

	res.render('admin/admincouponcreate', metadata)
	});



router.post('/admincouponcreate', (req, res) => {
	let { couponName, percentageDiscount, expiryDate, couponQuantity, userid, pointstoattain, redeemedquantity } = req.body;

	const metadata = {
		layout: 'admin',
		nav: {
			sidebarActive: 'coupon'
		}
	}
	redeemedquantity = 0;
	Coupon.create({ couponName, percentageDiscount, expiryDate, couponQuantity, userid, pointstoattain, redeemedquantity });
	flashMessage(res, 'success', couponName + ' has been created successfully');

	res.render('admin/admincouponcreate', metadata)
	});

router.get('/admincouponedit/:id',async (req, res)=> {
	let coupon = await Coupon.findOne({where: {id:req.params.id}})
	console.log(coupon)
	const metadata = {
		layout: 'admin',
		nav: {
			sidebarActive: 'dashboard'
		}
	}

	res.render('admin/admincouponedit', {coupon, layout: 'admin', nav: {sidebarActive: 'dashboards'}})
	});

router.post('/admincouponedit/:id', (req, res) => {
	let couponName = req.body.couponName;
	let percentageDiscount = req.body.percentageDiscount;
	let expiryDate = moment(req.body.expiryDate, ' YYYY-MM-DD HH:MI:SS');
	let couponQuantity = req.body.couponQuantity;
	let pointstoattain = req.body.pointstoattain
	
	const metadata = {
		layout: 'admin',
		nav: {
			sidebarActive: 'dashboard'
		}
	}
    Coupon.update(
        { couponName, percentageDiscount, expiryDate, couponQuantity, pointstoattain },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' coupon updated');
            res.redirect('/admin/admincouponlist');
        })
        // .catch(err => console.log(err));
	});


router.get('/admincouponlist', (req, res) => {
	const metadata = {
		layout: 'admin',
		nav: {
			sidebarActive: 'dashboard'
		}
	}
	Coupon.findAll({
		order: [['couponName', 'DESC']],
		raw: true
	})
		.then((coupons) => {
			// pass object to admincouponlist.handlebars
			metadata.coupons = coupons
			res.render('admin/admincouponlist', metadata);
		})
		.catch(err => console.log(err));


		// res.render('admin/admincouponlist', metadata)
	// res.render('admin/admincouponlist', metadata)
});



router.post('/admincoupondelete/:id', async function (req, res) {
	try {
		let coupon = await Coupon.findByPk(req.params.id);
		if (!coupon) {
			flashMessage(res, 'error', 'Coupon not found');
			res.redirect('/admin/admincouponlist');
			return;
		}

		let result = await Coupon.destroy({ where: { couponName: coupon.couponName } }); //change to delete from id
		flashMessage(res, 'success',result + ' coupon deleted');
		res.redirect('/admin/admincouponlist');
	}
	catch (err) {
	console.log(err);
	}
});

router.get('/couponstats', async (req, res) => {
	const metadata = {
		layout: 'admin',
		nav: {
			sidebarActive: 'coupon'
		}
	}

	var date = new Date();
	today = date.toISOString().slice(0,10) //Today's date

	date.setDate(date.getDate() - 1); 
	yesterday = date.toISOString().slice(0,10) //Yesterday's date

	date.setDate(date.getDate() - 1);
	twodaysback = date.toISOString().slice(0,10) // 2 days back date

	date.setDate(date.getDate() - 1);
	threedaysback = date.toISOString().slice(0,10) // 3 days back date

	date.setDate(date.getDate() - 1);
	fourdaysback = date.toISOString().slice(0,10) // 4 days back date

	const { count: todaycount } = await CouponRedemption.findAndCountAll({
		
		where: { DateofRedemption: today },
		groupBy: {
			DateofRedemption: today
		},
		
	});

	const { count: yesterdaycount } = await CouponRedemption.findAndCountAll({
		
		where: { DateofRedemption: yesterday },
		groupBy: {
			DateofRedemption: yesterday
		},
		
	});

	const { count: twodaysbackcount } = await CouponRedemption.findAndCountAll({
		
		where: { DateofRedemption: twodaysback },
		groupBy: {
			DateofRedemption: twodaysback
		},
		
	});

	const { count: threedaysbackcount } = await CouponRedemption.findAndCountAll({
		
		where: { DateofRedemption: threedaysback },
		groupBy: {
			DateofRedemption: threedaysback
		},
		
	});

	const { count: fourdaysbackcount } = await CouponRedemption.findAndCountAll({
		
		where: { DateofRedemption: fourdaysback },
		groupBy: {
			DateofRedemption: fourdaysback
		},
		
	});

	const { count: total } = await CouponRedemption.findAndCountAll({

	});
	
	console.log(total)

	metadata.todaycount = todaycount
	metadata.yesterdaycount = yesterdaycount
	metadata.twodaysbackcount = twodaysbackcount
	metadata.threedaysbackcount = threedaysbackcount
	metadata.fourdaysbackcount = fourdaysbackcount
	metadata.total = total
	res.render('admin/couponstats', metadata)
	
});


router.get('/couponstats', (req, res) => {
	const metadata = {
		layout: 'admin',
		nav: {
			sidebarActive: 'coupon'
		}
	}
	
	res.render('admin/couponstats', metadata)
	});
module.exports = router;
