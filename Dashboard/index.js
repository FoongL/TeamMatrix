// require needed modules 
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require ('fs');
const path = require('path');


//Setup middleware and packages
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', hbs({defaultLayout: 'dashboard'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/public')));



//Handle requests and responses to our seerver
app.get('/',(req, res)=>{
    res.render('index');
});

app.get('/login', (req , res)=>{
    res.render('login');
});



//Set the listening port of the application
app.listen(8080,()=>{
    console.log(
        'Apllication listening to port 8080'
    )
});
