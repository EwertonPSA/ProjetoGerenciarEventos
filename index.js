"use strict";
//const path = require("path");
const express = require('express');
const app = express();
//const handlebars = require('express-handlebars');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


app.use(express.static(__dirname + '/public'));

require('./routes/route')(app)
app.listen(process.env.DEFINE_PORT_NODE, function(){
    console.log("listen");
});