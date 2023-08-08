const express = require('express')
const router = express.Router();
const handlebars = require('express-handlebars');

// Menu

let count = 0; 

router.get('/', (req, res) => {
    res.render('index', {
        count,
        title: 'Pilot Flows'
    });
});

router.post('/increment', (req, res) => {
    count++; 
});

// Options

router.get('/aerosport', (req, res) => {
    res.render('application/aerosport',{
        title: 'Aerosport'
    }); 
})

module.exports = router