require('./models/mongodb');
//Import the necessary packages
const express = require('express');
const path = require('path');
const exphb = require('express-handlebars');
const bodyparser = require('body-parser');
const inventoryController = require('./controllers/inventoryController');

var app = express();

app.use(bodyparser.urlencoded({
    extended: true
    }));
app.use(bodyparser.json());

 //Configuring Express middleware for the handlebars
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphb({ extname: 'hbs', defaultLayout: 'mainLayout', layoutDir: __dirname + 'views/layouts/' }));
app.set('view engine', 'hbs'); 


app.listen(3000, ()=>{
    console.log('Express server started at port : 3000')
});

app.use('/inventory', inventoryController);