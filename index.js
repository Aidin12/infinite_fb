const fs = require('fs');
const puppeteer = require('puppeteer');

function extractItems() {
  const extractedItems = Array.from(document.querySelectorAll("#page > div.story_body_container"));
  const items = extractedItems.map(element => element.innerText);
 
  return items;
}

 async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  targetItemCount,
  scrollDelay = 1000
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < targetItemCount) { 
      items = await page.evaluate(extractItems); 
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(error) { 
    console.error(error);
  }
  return items;
} 

async function main() {
  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: false }); 
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the demo page.
  await page.goto('https://m.facebook.com/eveningstandard/');

  const targetItemCount = 5;

  const items = await scrapeInfiniteScrollItems( 
    page,
    extractItems,
    targetItemCount
  );

 console.log(items);
  }
  main(); 

