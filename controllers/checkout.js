

exports.renderPage = (req, res, next) => {
	res.render('home', {
        key: process.env.Publishable_Key
   })
};

exports.logToken = (req, res, next) => {
	console.log(req.body.stripeToken);
	res.status(200).json({ token: req.body.stripeToken});
};