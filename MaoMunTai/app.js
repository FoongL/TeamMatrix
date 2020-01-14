const express = require('express');
const app = express();
const session = require('express-session');
//const setupPassport = require('./init-passport');
const bodyParser = require('body-parser');
const https = require('https')
const fs = require('fs')
const router = require('./router/router')(express);
const path = require('path')
require('dotenv').config()

const port = process.env.PORT || 3030;

app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true
  })
);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

setupPassport(app);

app.use('/', router);

const options ={
  cert: fs.readFileSync('./localhost.crt'),
  key: fs.readFileSync('./localhost.key')
}

https.createServer(options, app).listen(8443);

