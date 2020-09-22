// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
// process.env.PORT MEANS WHATEVER IS IN THE ENVIRONMENT VARIABLE
// and right I need that for when I'm deploying otherwise it's a nono
var port     = process.env.PORT || 8190 ;

const MongoClient = require('mongodb').MongoClient
// the only reason we are able to use mongoose is because it's in the node_modules
// and of course I can't see it because the file was hiding when I downloaded it
// so meaning that all of the require that is here is being are of of course in the magic/invisible folder
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
// this is requiring the file
var configDB = require('./config/database.js');

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

// app.listen(port, () => {
//     MongoClient.connect(configDB.url, { useNewUrlParser: true }, (error, client) => {
//         if(error) {
//             throw error;
//         }
//         db = client.db(configDB.dbName);
//         console.log("Connected to `" + configDB.dbName + "`!");
//         require('./app/routes.js')(app, passport, db);
//     });
// });
// this is pointing to the passport file
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
// middle ware
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
// require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
// listening to the port
app.listen(port);
console.log('The magic happens on port ' + port);
