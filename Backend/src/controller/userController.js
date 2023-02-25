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

//mongoose.connect(config.mongodburl);
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
	name: String,
	macaddress: String,
	subcontractorid: String,
	sticker: {
		type: Number,
		required: true
	},
	created: Date,
	startdate: Date,
	project: {
		type: String,
		required: true
	},
	status: String,
	lock: Boolean, 
	photo: String,
	language: String,
	meta: {
		type: Map,
		of: String
	}
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

// var WorkerData = mongoose.model('Worker', workerDataSchema);
// var NotificationData = mongoose.model('Notification', notificationDataSchema);

// exports.getWorkers = (req, res, next) => {
// 	WorkerData.find()
// 		.then(function (response) {
// 			//console.log(response);
// 			res.status(200).json({
// 				data: response
// 			});
// 		});
// };

// exports.createWorker = (req, res, next) => {
// 	var item = (({
// 		name,
// 		subcontractorid,
// 		sticker,
// 		project,
// 		status,
// 		macaddress,
// 		meta
// 	}) => ({
// 		name,
// 		subcontractorid,
// 		sticker,
// 		project,
// 		status,
// 		macaddress,
// 		meta
// 	}))(req.body);
	
// 	item.lock = false;
// 	var workerToSave = new WorkerData(item);
// 	workerToSave.save();

// 	logger.info('Worker created  - '+JSON.stringify(workerToSave));
// 	res.status(200).json({
// 		data: workerToSave
// 	});
// };

// exports.updateWorker = (req, res, next) => {
// 	var item = (({
// 		_id,
// 		name,
// 		subcontractorid,
// 		sticker,
// 		project,
// 		status,
// 		lock,
// 		photo,
// 		signature,
// 		macaddress,
// 		meta
// 	}) => ({
// 		_id,
// 		name,
// 		subcontractorid,
// 		sticker,
// 		project,
// 		status,
// 		lock,
// 		photo,
// 		signature,
// 		macaddress,
// 		meta
// 	}))(req.body);

// 	WorkerData.findById(item._id, function (err, workerToSave) {
// 		const meta = JSON.parse(JSON.stringify(item.meta));
// 		Object.assign(workerToSave, item);
// 		axios.post(config.kloudspotbaseurl + '/api/public/v1/auth/login', {
// 			'id': config.kloudspotid,
// 			'secretKey': config.kloudspotsecret
// 		}).then(function (jwtresp) {
// 			logger.debug('JWT Token -> ' + jwtresp.data);
// 			const jwttoken = jwtresp.data;

// 			const payload = {
// 				"sticker": item.sticker,
// 				"phone": meta.phone,
// 				"subcontractor": item.subcontractorid,
// 				"name": item.name,
// 				"mac": item.macaddress
// 			};
// 			logger.debug('Sending Worker Edit request to Epsilon');
// 			axios.post(config.kloudspotbaseurl + '/api/public/v1/client/updateworker', payload, {
// 				headers: {
// 					Authorization: "Bearer " + jwttoken
// 				}
// 			}).then(function (clientresp) {
// 				if (clientresp.data.data==null || clientresp.data.error) {
// 					res.status(400).json({
// 						data: clientresp.data
// 					})
// 					return;
// 				}
// 				workerToSave.save();
// 				logger.info('Worker updated  - '+JSON.stringify(workerToSave));
// 				res.status(200).json({
// 					data: clientresp.data
// 				});
// 			});
// 	});
// });
// }

// exports.deleteWorker = (req, res, next) => {
// 	var id = req.params.id;
// 	WorkerData.findById(id, function (err, worker) {

// 		axios.post(config.kloudspotbaseurl + '/api/public/v1/auth/login', {
// 			'id': config.kloudspotid,
// 			'secretKey': config.kloudspotsecret
// 		}).then(function (jwtresp) {
// 			logger.debug('JWT Token -> ' + jwtresp.data);
// 			const jwttoken = jwtresp.data;

// 			const payload = {
// 				"mac": worker.macaddress,
// 				"deactivate": "true"
// 			};
// 			logger.debug('Sending Worker Deactivate request to Epsilon');
// 			axios.post(config.kloudspotbaseurl + '/api/public/v1/client/updateworker', payload, {
// 				headers: {
// 					Authorization: "Bearer " + jwttoken
// 				}
// 			}).then(function (clientresp) {
// 				if (clientresp.data.data==null || clientresp.data.error) {
// 					res.status(400).json({
// 						data: clientresp.data
// 					})
// 					return;
// 				}
// 				WorkerData.findByIdAndRemove(id).exec();
// 				logger.info('Worker '+worker.name+' deactivated from Epsilon and deleted from Database');
// 				res.status(200).json({
// 					data: clientresp.data,
// 					error: false
// 				});
// 				return;
// 				})
// 				.catch((e)=>{
// 					res.status(400).json({
// 						error: true
// 					});
// 				});
// 			});
// 		});
// 	}