const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');
const path = require('path');

const BASE_DELAY = 5000;

const options = new firefox.Options();
const TEMP_DIR = __dirname + '/temp';

options.setPreference("browser.download.folderList", 2);
options.setPreference("browser.download.dir", TEMP_DIR);
options.setPreference("browser.download.useDownloadDir", true);
options.setPreference("browser.helperApps.neverAsk.saveToDisk", "application/octet-stream,application/zip");

// remove slice at the end
const urls =  fs.readFileSync('missing.txt', 'utf8').split("\n");

function deleteTempFiles() {
  var items = fs.readdirSync(TEMP_DIR);
    for (item of items) {
      console.log('DELETING: ' + `${TEMP_DIR}/${item}`);
      fs.unlinkSync(`${TEMP_DIR}/${item}`);
    }
}

function getDestDir(url) {
    const myURL = new URL(url);
    return __dirname + '/' + path.basename(path.dirname(myURL.pathname));
}

function processResults(destDir) {
  var items = fs.readdirSync(TEMP_DIR);
  if (items.length === 1) {
    var item = `${TEMP_DIR}/${items[0]}`;
    console.log('PROCESSING: ' + item);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir);
      var name = path.basename(items[0], '.sb3');
      fs.renameSync(item, destDir + '/index.sb3');
      fs.writeFileSync(destDir + '/name.txt', name);
      fs.writeFileSync(destDir + '/' + name + '.txt', '');
    }
    deleteTempFiles();
   } else {
    console.log("Error: wrong number of items in the temp directory:" + items.length);
    deleteTempFiles();
  }
}

(async function example() {
  let driver = await new Builder().forBrowser('firefox')
   .setFirefoxOptions(options)
   .build();   
  try {
    deleteTempFiles();
    for (urlbase of urls) {
      const url = `https://${urlbase}/editor`;
      var destDir = getDestDir(url);
      if (!fs.existsSync(destDir)) {
        console.log("LOADING: " + url);
        await driver.get(url); 
        await driver.sleep(BASE_DELAY);
        await driver.wait(until.elementLocated(By.xpath("//span[text()='File']")), BASE_DELAY*4);
        await driver.findElement(By.xpath("//span[text()='File']")).click();
        await driver.wait(until.elementLocated(By.xpath("//span[text()='Save to your computer']")), BASE_DELAY*2);
        await driver.findElement(By.xpath("//span[text()='Save to your computer']")).click();
        await driver.sleep(BASE_DELAY*3);
        processResults(destDir);
      } else {
        console.log('SKIPPING, ALREADY EXISTS:' + destDir);
      }
    }
  } finally {
    await driver.quit();
  }
})();
