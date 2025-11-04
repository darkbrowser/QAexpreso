const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
//const PDFMerger = (await import('pdf-merger-js')).default;

const tabs = ['#', '#categories', '#suites', '#graph', '#timeline', '#behaviors', '#packages'];
const allureServerUrl = process.env.ALLURE_SERVER_URL;
console.log('Allure server:', allureServerUrl);
const baseUrl = 'http://127.0.0.1:49578/'; // Allure static server

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();a
  await page.setViewport({ width: 1920, height: 1080 });

  const pdfPaths = [];

  for (const tab of tabs) {
    const url = `${baseUrl}${tab}`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait for charts or graphs to render
    await page.waitForSelector('canvas, svg', { timeout: 5000 }).catch(() => {
      console.warn(`⚠️ No chart found on ${tab}`);
    });

    // Scroll to trigger lazy loading
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await page.waitForResponse;
    // Adjust selector to match your items
  const items = await page.$$('.item-selector');

  for (let i = 0; i < items.length; i++) {
    const currentItems = await page.$$('.item-selector');
    const item = currentItems[i];

    if (item) {
      await item.click();
      console.log(`Clicked item ${i + 1}`);
      await page.waitForTimeout(500); // adjust if needed
    }
  }
    //await page.waitForTimeout(1000);

    const tabName = tab.replace('#', '') || 'dashboard';
    const pdfPath = path.resolve(__dirname, `allure-${tabName}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A3',
      landscape: true,
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm' }
    });

    pdfPaths.push(pdfPath);
    console.log(`✅ Saved ${tabName} to ${pdfPath}`);
  }

  await browser.close();

  const { default: PDFMerger } = await import('pdf-merger-js');
const merger = new PDFMerger();

for (const pdf of pdfPaths) {
  if (fs.existsSync(pdf) && fs.statSync(pdf).size > 1000) {
    merger.add(pdf);
  } else {
    console.warn(`⚠️ Skipping ${pdf} — file missing or empty`);
  }
}

const finalPath = path.resolve(__dirname, 'allure-full-report.pdf');
await merger.save(finalPath);
console.log(`📎 Merged report saved to ${finalPath}`);
  // const { default: PDFMerger } = await import('pdf-merger-js');
  // const merger = new PDFMerger();
  // for (const pdf of pdfPaths) {
  //   merger.add(pdf);
  // }
  // const finalPath = path.resolve(__dirname, 'allure-full-report.pdf');
  // await merger.save(finalPath);
  // console.log(`📎 Merged report saved to ${finalPath}`);
})();
