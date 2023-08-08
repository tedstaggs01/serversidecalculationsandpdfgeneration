const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { data } = require('./aerosport_data');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const Handlebars = require('handlebars');

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
    const airplanename = airplaneData.name; 
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
    const zfmcgin = zfmcg * 39.37;
    const fuel = parseFloat(req.body.fuel);
    const fuelcg = airplaneData.fuelcg;
    const fuelmo = fuel * fuelcg; 
    const ramp = zfm + fuel; 
    const ramplbs = ramp * 2.205; 
    const rampmo = zfmmo + fuelmo;
    const rampcg = rampmo / ramp;  
    const rampcgin = rampcg * 39.37;
    const taxi = parseFloat(req.body.taxi);
    const taximo = taxi * fuelcg;
    const tom = ramp - taxi; 
    const tomlbs = tom * 2.205; 
    const tommo = rampmo - taximo; 
    const tomcg = tommo / tom; 
    const tomcgin = parseFloat(tomcg * 39.37); 
    const trip = parseFloat(req.body.trip);
    const tripmo = trip * fuelcg; 
    const lm = tom - trip; 
    const lmlbs = lm * 2.205; 
    const lmmo = tommo - tripmo; 
    const lmcg = lmmo / lm; 
    const lmcgin = parseFloat(lmcg * 39.37); 
    const remUsefulL = airplaneData.maxramp - ramp; 
    const remUsefulLlbs = remUsefulL * 2.205;

    const envelope = [
        {x:airplaneData.maxfwdcgL, y: airplaneData.minmL},
        {x:airplaneData.maxfwdcgL, y:airplaneData.minmLH},
        {x:airplaneData.maxfwdcgH, y:airplaneData.minmHH},
        {x:airplaneData.maxfwdcgHH, y:airplaneData.minmHHH},
        {x:airplaneData.maxaftcg, y:airplaneData.minmHHH},
        {x:airplaneData.maxaftcg, y:airplaneData.minmL},
        {x:airplaneData.maxfwdcgL, y:airplaneData.minmL}
    ]; 

    const utility = [
        {x:airplaneData.maxfwdcgUL , y:airplaneData.minUL},
        {x:airplaneData.maxfwdcgUL, y:airplaneData.minUH},
        {x:airplaneData.maxfwdcgUH, y:airplaneData.minUHH},
        {x:airplaneData.maxaftcgU, y: airplaneData.minUHH},
        {x:airplaneData.maxaftcgU, y: airplaneData.minUL}
    ]; 

    const mb = [
        {x:rampcgin , y:ramplbs},
        {x:tomcgin, y: tomlbs},
        {x:lmcgin, y: lmlbs}, 
        {x:zfmcgin, y: zfmlbs}
    ]; 

    const envelopeJSON = JSON.stringify(envelope); 
    const utilityJSON = JSON.stringify(utility); 
    const mbJSON = JSON.stringify(mb); 

    res.render('result', { 
        crew,
        pax,
        bag, 
        zfm,
        zfmlbs, 
        fuel,
        ramp, 
        ramplbs, 
        taxi, 
        tom, 
        tomlbs, 
        trip, 
        lm, 
        lmlbs,
        remUsefulL, 
        remUsefulLlbs, 
        envelopeJSON, 
        utilityJSON, 
        mbJSON, 
        airplanename
    });
});


router.get('/generate-pdf', async (req, res) => {
    const pdfData = {
        title: "heehoeoeo"
    };

    try {
        // Compile the Handlebars template
        const templatePath = './templates/resultpdf.handlebars'; // Relative path to the template
        const templateSource = await fs.readFile(templatePath, 'utf-8');
        const compiledTemplate = Handlebars.compile(templateSource);
        const content = compiledTemplate(pdfData);
        
        // Rest of your PDF generation code ...

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("Error generating PDF");
    }
});


router.get('/resultpdf', (req, res) => {
    res.render('./templates/resultpdf')
}); 

router.get('/aerosport', (req, res) => {
    res.render('application/aerosport', {
        title: 'Aerosport'
    });
});

module.exports = router;
