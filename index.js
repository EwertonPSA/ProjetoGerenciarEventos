"use strict";
const path = require("path");
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const dotenv = require('dotenv');
dotenv.config();

app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

app.set("views", path.join(__dirname, '/app/views'));

app.engine('hbs', handlebars({
    layoutsDir: `${__dirname}/app/views/layouts`,
    extname: 'hbs',
    defaultLayout: 'index'
}));

require('./routes/route')(app)
app.listen(9001, function(){
    console.log("listen");
});