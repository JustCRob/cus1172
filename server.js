var express = require("express");
var app = express();
const session = require('express-session');

const authent1 = require('./routes/auth1');
const videoRoutes = require('./routes/video');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(session({
    secret: 'someKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));


app.use(express.static('resources'));

app.use('/auth1', authent1);
app.use('/video', videoRoutes);




app.get('/', function (req, res) {
    res.render('welcome')
});

app.listen(3000, function () {
    console.log("Server is running!");
}
);


