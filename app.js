const express = require('express');
const exphbs = require('express-handlebars');
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var app = express();
const MongoStore = require('connect-mongo')(session);
//Load router
ideas_router = require('./routers/ideas');
users_router = require('./routers/users');

//Connect ot mongoess 
/*
mongoose.connect("mongodb://localhost/vidjot-dev").
then(() => console.log('Connected to Mongo')).
catch(err => console.log(err));
*/
mongoose.connect("mongodb://RefaatAish:Refo10466@ds127811.mlab.com:27811/devjot-prod").
then(() => console.log('Connected to Mongo')).
catch(err => console.log(err));
//passport config
require('./config/passport')(passport);

/*========================================================
  ====================  middlewares ======================
  ========================================================
*/
//Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body-pareser middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//methodOverride middleware
app.use(methodOverride('_method'))

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        maxAge: 180 * 60 * 1000
    }
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect-flash middleware
app.use(flash());

//Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.session = req.session;
    next();
});
//Set public folder
app.use(express.static(path.join(__dirname, "public")));

/*========================================================
  =======================  Routers =======================
  ========================================================
*/
//Index Page
app.get('/', (req, res) => {
    var title = "Welcome";
    res.render('index', {
        title: title
    });
});
//About Page
app.get('/about', (req, res) => {
    res.render('about');
});
//Use routers
app.use('/ideas', ideas_router);
app.use('/users', users_router);

//Config for heroku
const port = process.env.PORT || 3000;
//Listen server
app.listen(port, () => {
    console.log(`server started with port ${port}`)
});