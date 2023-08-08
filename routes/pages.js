const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { data } = require('./aerosport_data');

router.use(bodyParser.urlencoded({ extended: true }));

let count = 0;

router.get('/', (req, res) => {
    res.render('index', {
        count,
        title: 'Pilot Flows'
    });
});

router.post('/result', (req, res) => {
    const selectedAirplane = req.body.airplaneoption;
    const airplaneData = data[selectedAirplane];
    const bem = airplaneData.bem;
    const bemcg = airplaneData.bemcg; 
    const bemmo = bem * bemcg; 
    const crew = parseFloat(req.body.crew);
    const crewcg = airplaneData.crewcg;
    const crewmo = crew * crewcg; 
    const pax = parseFloat(req.body.pax);
    const paxcg = airplaneData.paxcg; 
    const paxmo = pax * paxcg; 
    const bag = parseFloat(req.body.baggage);
    const bagcg = airplaneData.bagcg; 
    const bagmo = bag * bagcg; 
    const zfm = bem + crew + pax + bag;
    const zfmlbs = zfm * 2.205; 
    const zfmmo = bemmo + crewmo + paxmo + bagmo; 
    const zfmcg = zfmmo / zfm; 
    const fuel = parseFloat(req.body.fuel);
    const fuelcg = selectedAirplane.fuelcg; 
    const fuelmo = fuel * fuelcg; 
    const ramp = zfm + fuel; 
    const ramplbs = ramp * 2.205; 
    const rampmo = zfmmo + fuelmo;
    const rampcg = rampmo / ramp;  
    const taxi = parseFloat(req.body.taxi);
    const taximo = taxi * fuelcg;
    const tom = ramp - taxi; 
    const tomlbs = tom * 2.205; 
    const tommo = rampmo - taximo; 
    const tomcg = tommo / tom; 
    const trip = parseFloat(req.body.trip);
    const tripmo = trip * fuelcg; 
    const lm = tom - trip; 
    const lmlbs = lm * 2.205; 
    const lmmo = tommo - tripmo; 
    const lmcg = lmmo / lm; 

    console.log(selectedAirplane);
    console.log(bem);
    res.render('result', { totalWeight });
});

router.get('/result', (req, res) => {
    res.render('result');
});

router.get('/aerosport', (req, res) => {
    res.render('application/aerosport', {
        title: 'Aerosport'
    });
});

module.exports = router;
