const express = require('express');
const app = express();
const routes = require('./src/routes/main');
const port = 8080
const mongoose = require("mongoose");
const log4js = require('log4js');
const passport = require('passport');
const bodyParser = require("body-parser");
const { urlencoded } = require('body-parser');
const prodMode = false;
const cookieSession = require('cookie-session');
var session = require('express-session');
mongoose.connect('mongodb://localhost:27017/usersdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const LocalStrategy = require('passport-local').Strategy

log4js.configure({
	appenders: { activity: { type: 'file', filename: '/var/log/xanax/activity.log', maxLogSize: 10485760, backups: 10, compress: true } },
	categories: { default: { appenders: ['activity'], level: 'debug' } }
});

const logger = log4js.getLogger();

app.use(urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieSession({
	name: 'mysession',
	keys: ['vueauthrandomkey'],
	maxAge: 24 * 60 * 60 * 1000 // 24 hours 
}));

// app.use(passport.initialize());
// app.use(passport.session());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"OPTIONS, GET, POST, PUT, PATCH, DELETE"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin'); // redirect to sign-in route
  }

  next();
};

// passport.use(new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// },
// async (email, password, done) => {
//   //console.log('Login attempt by ' + email);

//   const u = {
//     'email': email,
//     'password': password
//   };
//   await userController.validateUser(u).then(function (user) {
//     //Resolve
//     done(null, user);
//   }, function () {
//     //Reject
//     done(null, false, {
//       message: 'Incorrect username or password'
//     });
//   });
// }
// ));

// passport.serializeUser((user, done) => {
// //console.log('Serializing user..');
// done(null, user.email);
// });

// passport.deserializeUser(async (email, done) => {
// //console.log('Deserializing user from ' + email);
// await userController.getUserByEmail({
//   'email': email
// }).then(function (user) {
//   done(null, user);
// });
// });

//serve out the api
app.use("/api/", isAuthenticated, routes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})