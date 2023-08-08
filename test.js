const compile = async function (templateName, data) {
    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
};

(async function () {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const data = {
            // Your data goes here
        };

        // Compile the Handlebars template
        const content = await compile('loadsheet', data);

        await page.setContent(content);

        await page.pdf({
            path: 'loadsheet.pdf',
            format: 'A4',
            printBackground: true
        });

        console.log("PDF creation completed");
        /*await browser.close();
        process.exit();*/
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();