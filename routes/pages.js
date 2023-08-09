const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { data } = require('./aerosport_data');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');
const Handlebars = require('handlebars');

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/result', (req, res) => {
    const selectedAirplane = req.body.airplaneoption;
    const airplaneData = data[selectedAirplane];
    const airplanename = airplaneData.name; 
    const bem = airplaneData.bem;
    const bemcg = airplaneData.bemcg; 
    const bemmo = bem * bemcg; 
    const bemmop = bemmo.toFixed(3);
    const crew = parseFloat(req.body.crew);
    const crewcg = airplaneData.crewcg;
    const crewmo = crew * crewcg; 
    const crewmop = crewmo.toFixed(3);
    const pax = parseFloat(req.body.pax);
    const paxcg = airplaneData.paxcg; 
    const paxmo = pax * paxcg; 
    const paxmop = paxmo.toFixed(3);
    const bag = parseFloat(req.body.baggage);
    const bagcg = airplaneData.bagcg; 
    const bagmo = bag * bagcg; 
    const bagmop = bagmo.toFixed(3);
    const zfm = bem + crew + pax + bag;
    const zfmlbs = (zfm * 2.205).toFixed(2); 
    const zfmmo = bemmo + crewmo + paxmo + bagmo; 
    const zfmmop = zfmmo.toFixed(3);
    const zfmcg = (zfmmo / zfm).toFixed(2); 
    const zfmcgin = (zfmcg * 39.37).toFixed(2);
    const fuel = parseFloat(req.body.fuel);
    const fuelcg = airplaneData.fuelcg;
    const fuelmo = fuel * fuelcg; 
    const fuelmop = fuelmo.toFixed(3);
    const ramp = zfm + fuel; 
    const ramplbs = (ramp * 2.205).toFixed(2); 
    const rampmo = zfmmo + fuelmo;
    const rampmop = rampmo.toFixed(3);
    const rampcg = (rampmo / ramp).toFixed(2);  
    const rampcgin = (rampcg * 39.37).toFixed(2);
    const taxi = parseFloat(req.body.taxi);
    const taximo = taxi * fuelcg;
    const taximop = taximo.toFixed(3);
    const tom = ramp - taxi; 
    const tomlbs = (tom * 2.205).toFixed(2); 
    const tommo = rampmo - taximo; 
    const tommop = tommo.toFixed(3);
    const tomcg = (tommo / tom).toFixed(2); 
    const tomcgin = (tomcg * 39.37).toFixed(2); 
    const trip = parseFloat(req.body.trip);
    const tripmo = trip * fuelcg; 
    const tripmop = tripmo.toFixed(3);
    const lm = tom - trip; 
    const lmlbs = (lm * 2.205).toFixed(2); 
    const lmmo = tommo - tripmo; 
    const lmmop = lmmo.toFixed(3);
    const lmcg = (lmmo / lm).toFixed(2); 
    const lmcgin = (lmcg * 39.37).toFixed(2); 
    const remUsefulL = (airplaneData.maxramp - ramp).toFixed(2); 
    const remUsefulLlbs = (remUsefulL * 2.205).toFixed(2);

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

    req.app.locals.calculatedData = {
        bem,
        bemcg,
        bemmop,
        crew,
        crewcg, 
        crewmop, 
        pax,
        paxcg, 
        paxmop, 
        bag,
        bagcg, 
        bagmop,
        zfm,
        zfmlbs, 
        zfmcg, 
        zfmcgin,
        zfmmop, 
        fuel, 
        fuelcg, 
        fuelmop, 
        ramp, 
        ramplbs,
        rampcg, 
        rampcgin,
        rampmop, 
        taxi, 
        taximop,
        tom, 
        tomlbs, 
        tomcg, 
        tomcgin, 
        tommop,
        trip, 
        tripmop, 
        lm, 
        lmlbs, 
        lmcg, 
        lmcgin, 
        lmmop
    };


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

router.get('/create-pdf', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Read the Handlebars template
        const templatePath = path.join(__dirname, '../templates', 'loadsheet.handlebars');
        const templateSource = await fs.readFile(templatePath, 'utf-8');

        // Compile the template with Handlebars
        const template = Handlebars.compile(templateSource);

        const renderedData = req.app.locals.calculatedData;

        // Get the data from the previous rendering in /result route
        /*const renderedData = {
            bem: req.app.locals.bem,
            bemcg: req.app.locals.bemcg, 
            bemmo: req.app.locals.bemmo, 
            crew: req.app.locals.crew,
            crewcg: req.app.locals.crewcg,
            crewmo: req.app.locals.crewmo, 
            pax: req.app.locals.pax,
            paxcg: req.app.locals.paxcg, 
            paxmo: req.app.locals.paxmo, 
            bag: req.app.locals.bag,
            bagcg: req.app.locals.bagcg,
            bagmo: req.app.locals.bagmo
        };*/

        // Compile the template with the rendered data
        const compiledHtml = template(renderedData);

        // Set the compiled HTML as the page content
        await page.setContent(compiledHtml);

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=loadsheet.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('An error occurred');
    }
});



router.get('/aerosport', (req, res) => {
    res.render('application/aerosport', {
        title: 'Aerosport'
    });
});

module.exports = router;
