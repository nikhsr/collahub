const express = require('express');
const log4js = require('log4js');

const userController = require('../controller/userController');

const logger = log4js.getLogger();
const router = express.Router();

//Create a new user or Update existing user /user
router.post('/user', function (req, res, next) {
	if (req.body._id && req.body._id.length > 0) {
		userController.updateUser(req, res, next);
	} else {
		userController.createUser(req, res, next);
	}
});

router.delete('/user/:id', userController.deleteUser);

router.get('/users', userController.getUser);
