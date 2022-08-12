const ApiError = require('../errors/apiError');
const User = require('../models/user');
const stripe = require('stripe')(process.env.Secret_Key)


exports.renderPage = (req, res, next) => {
	res.render('home', {
        key: process.env.Publishable_Key
   })
};

exports.logToken = (req, res, next) => {
	console.log(req.body.stripeToken);
	res.status(200).json({ token: req.body.stripeToken});
};

exports.addPayment = (req, res, next) => {
    console.log(req.body.stripeToken);
		console.log(req.userId);
    //res.status(200).json({ message: 'Payment'});

    User.findById(req.userId).then(user => {
		return user;
	})
    .then(user => {
        return stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: user.name,
            id: req.userId,
            address: {
                line1: 'temp',
                postal_code: '452331',
                city: 'temp',
                state: 'temp',
                country: 'temp',
            }
        })
    })
    .then((customer) => {
        return stripe.charges.create({
            amount: 3000,     // Charing Rs 30
            description: 'User Subcription for social feed',
            currency: 'USD',
            customer: customer.id
        });
    })
    .then((charge) => {
				console.log(charge);
        return User.findById(req.userId);
    })
    .then((user) => {
        user.isPaid = true;
        return user.save();
    })
    .then( result => {
        res.status(200).json({ message: 'Payment Success. Subscribed to social feed.'});
    })
	.catch(err => {
		next(err);
	}); 
};
 