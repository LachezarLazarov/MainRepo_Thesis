require('dotenv').config(); 

const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const  cors = require('cors')
const errorController = require('./controllers/error');

const cookieSession = require('cookie-session')

const db = require("./models");

db.sequelize.sync({ force : true}).then(() => {
  console.log('Drop and Resync Db');
});
const app = express();

const ports = process.env.PORT || 3000;
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
    name: "login-session",
    secret: process.env.COOKIE_SECRET,
    httpOnly: true
  }))
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);
app.use('/post', postRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

app.listen(ports, () => console.log(`Listening on port ${ports}`));