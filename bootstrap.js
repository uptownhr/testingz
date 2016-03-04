const express = require('express'),
  mongoose = require('mongoose'),
  config = require('./config'),
  path = require('path'),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongostore')(session),
  flash = require('express-flash'),
  multer = require('multer'),
  upload = multer({ dest: path.join(__dirname, 'uploads') }),
  expressValidator = require('express-validator'),
  cookieParser = require('cookie-parser')


/*connect to mongodb */
mongoose.connect(config.mongodb)
mongoose.connection.on('error', function(){
  console.log('Mongodb connection error')
  process.exit(1)
})

/* configure application */
const app = express()
app.set('view engine', 'jade');
app.locals.pretty = true

// listen on config port, default 3000
app.listen(config.port, function(e){
  console.log('listening on', config.port)
})

//specify public static directory
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: new MongoStore({'db': 'sessions'})
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req,res,next) => {
  res.locals.user = req.user
  next()
})

module.exports = app