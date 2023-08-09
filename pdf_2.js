const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle PDF creation route
// Handle PDF creation route
app.get('/create-pdf', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();


        const templatePath = path.join(__dirname, 'templates', 'loadsheet.handlebars');
        const templateSource = await fs.readFile(templatePath, 'utf-8');

        // Compile the template with Handlebars
        const template = Handlebars.compile(templateSource);
        const compiledHtml = template({
            test: 'AWESOMEE',
            pageContent: 'This is the content of my page.'
        });

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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
