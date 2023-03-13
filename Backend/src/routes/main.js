const express = require('express');
const log4js = require('log4js');

const userController = require('../controller/userController');

var { GRAPH_ME_ENDPOINT } = require('../../authConfig');
const logger = log4js.getLogger();
const router = express.Router();

// custom middleware to check auth state


router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'MSAL Node & Express Web App',
        isAuthenticated: req.session.isAuthenticated,
        username: req.session.account?.username,
    });
});

//Create a new user or Update existing user /user
router.post('/user', function (req, res, next) {
	if (req.body._id && req.body._id.length > 0) {
		userController.updateUser(req, res, next);
	} else {
		userController.createUser(req, res, next);
	}
});

router.get('/simple', (req,res, next)=>{
	res.status(200).json({
		data: "hi"
	});
});

router.delete('/user/:id', userController.deleteUser);

router.get('/users', userController.getUser);

module.exports = router;