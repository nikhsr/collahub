const mongoose = require('mongoose');
const axios = require('axios');
const log4js = require('log4js');
//const config = require('../config/config');
const moment = require('moment');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const logger = log4js.getLogger();

//const twilio = require('twilio')(config.twilioSid, config.twilioAuthToken);
//const MessagingResponse = require('twilio').twiml.MessagingResponse;


mongoose.connect('mongodb://localhost:27017/usersdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

var Schema = mongoose.Schema;

var userDataSchema = new Schema({
	name: String,
	email: String,
    password: String,
	level: {
		type: Number,
		required: true
	},
	created: Date,
	status: String,
	lock: Boolean, 
	avatar: String,
	language: String,
	projects: [String]
}, {
	collection: 'Users',
	timestamps: true
});

var notificationDataSchema = new Schema({
	name: String,
	sid: String,
	from: String,
	to: String,
	message: String,
	eventid: String,
	eventname: String,
	status: String,
	type: String
}, {
	collection: 'Notifications',
	timestamps: true
});

 var UserData = mongoose.model('User', userDataSchema);
 var NotificationData = mongoose.model('Notification', notificationDataSchema);

exports.getUser = (req, res, next) => {
	UserData.find()
		.then(function (response) {
			//console.log(response);
			res.status(200).json({
				data: response
			});
		});
};

exports.createUser = (req, res, next) => {
	var item = (({
		name,
        email,
        password,
        avatar,
        projects
	}) => ({
		name,
        email,
        password,
        avatar,
        projects
	}))(req.body);
	
	item.lock = false;
    item.level = 0;
	var userToSave = new UserData(item);
	userToSave.save();

	logger.info('Worker created  - '+JSON.stringify(userToSave));
	res.status(200).json({
		data: workerToSave
	});
};

exports.updateUser = (req, res, next) => {
	var item = (({
		_id,
		name,
        email,
        password,
        avatar,
        projects
	}) => ({
		_id,
		name,
        email,
        password,
        avatar,
        projects
	}))(req.body);

	UserData.findById(item._id, function (err, userToSave) {
		userToSave.save();
		logger.info('Worker updated  - '+JSON.stringify(userToSave));
		res.status(200).json({
			data: clientresp.data
		});
});
}

exports.deleteUser = (req, res, next) => {
	var id = req.params.id;
    WorkerData.findByIdAndRemove(id).exec();
    res.status(200).json({
        data: "removed successfuly",
        error: false
    });
}
