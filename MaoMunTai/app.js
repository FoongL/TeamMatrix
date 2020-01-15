//-------------- Setting up required packages 
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const https = require('https')
const fs = require('fs')
const path = require('path')
const hbs = require('express-handlebars');
const pg = require('pg');

//-------------- General package setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
require('dotenv').config()

//-------------- Handlebars setup
app.engine('handlebars', hbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//-------------- authentication setup
const setupPassport = require('./authentication/initPassport');
const loginRouter = require('./router/loginRouter')(express);
app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true
  })
);
setupPassport(app);



//-------------- Routers setup
app.use('/', loginRouter);

const options ={
  cert: fs.readFileSync('./localhost.crt'),
  key: fs.readFileSync('./localhost.key')
}

https.createServer(options, app).listen(8443);

