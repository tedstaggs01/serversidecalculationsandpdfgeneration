const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

(async function() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Read the Handlebars template
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

        await fs.writeFile('loadsheet.pdf', pdfBuffer);
        console.log('Done');
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();
