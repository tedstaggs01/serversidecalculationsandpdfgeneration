const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path'); 
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');

app.use('/', require('./routes/pages'));

app.use(express.static('public')); 

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080);