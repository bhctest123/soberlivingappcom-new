import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOGImage() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to exact dimensions
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 1
  });
  
  // Load the HTML file
  const htmlPath = path.join(__dirname, '..', 'public', 'create-og-image.html');
  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0'
  });
  
  // Take screenshot
  const outputPath = path.join(__dirname, '..', 'public', 'og-image.jpg');
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 95,
    fullPage: false
  });
  
  await browser.close();
  
  console.log(`Generated og-image.jpg at: ${outputPath}`);
}

generateOGImage().catch(console.error);