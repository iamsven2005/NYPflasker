const Handlebars = require('handlebars');
const moment = require('moment');
const { DATEONLY } = require('sequelize');
const formatDate = function (date, targetFormat) {
    return moment(date).format(targetFormat);
};

const replaceCommas = function(value) {
    return value ? value.replace(/,/g,' | ') : 'None';
}

const checkboxCheck = function (value, checkboxValue) {
    return (value.search(checkboxValue) >= 0 ? 'checked' : '')
}

const radioCheck = function (value, radioValue) {
    return (value == radioValue ? 'checked' : '')
}

const ifEquals = function (value, CorrectValue) {
    return (value == CorrectValue ? "active" : '')
}

const ifmoney = function(amountSpent) {
    console.log(amountSpent)
    return (amountSpent >= 50 ? true : false)
}
    
// Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
//     return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
// });

const checkdiscount = function(discount){
    if (discount > 0) {
        return true;
    }else{
        return false;
    }
};

const checkstock = function(stock){
    if (stock > 0) {
        return true;
    }else{
        return false;
    }
};

const checkurl = function(arg1, arg2) {
    if (arg1 == arg2){
        return true;
    }else{
        return false;
    }
}
const ifstatus = function(value, cvalue) {
    return (value == cvalue ? true : false)
}

const isStaff = function(userType) {
	return (userType == 'staff' || userType == 'admin' || userType == 'madmin')
};
const isAdmin = function(userType) {
	return (userType == 'admin' || userType == 'madmin')
};
const isMAdmin = function(userType) {
	return (userType == 'madmin')
};

const getDateOnly = function(date){
    return require('moment')(date).format('DD-MM-YYYY');
}
module.exports = {formatDate, replaceCommas, checkboxCheck, radioCheck, ifEquals, checkdiscount, checkstock,checkurl, ifmoney, ifstatus, isStaff, isAdmin, isMAdmin, getDateOnly};
