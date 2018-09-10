var scrape = require('website-scraper');

var sites = [
/* { urls: ["http://www.google.com/css/maia.experimental.css"], recursive: false},
 { urls: ["http://www.google.com/js/google.js"], recursive: false},
 { urls: ["http://www.google.com/js/maia.js"], recursive: false},
 { urls: ["http://js-agent.newrelic.com/nr-632.min.js"], recursive: false},
 { urls: ["http://fonts.googleapis.com/css?family=Open+Sans+Condensed:700,300"], recursive: false},
 { urls: ["http://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900"], recursive: false},*/
  { urls: ["https://csfirst.withgoogle.com/c/cs-first/en/curriculum.html"], recursive: true, maxRecursiveDepth: 50},
];

var domains = [
  "csfirst.withgoogle.com",
  "www.cs-first.com",
  "cs-first.com",
  "files.cs-first.com",
  "fonts.googleapis.com",
  "ajax.googleapis.com",
  "storage.googleapis.com",
  "fonts.gstatic.com",
  "apis.google.com",
  "ssl.gstatic.com",
  "csfirst-files.storage.googleapis.com",
];

var excludeDirectories = [
  "/users",
];

var rejectExtensions = [
  ".ogv",
  ".zip",
];

var options = {
  urls: ['http://nodejs.org/'],
  directory: '/path/to/save/',
};

// var x = new URL(" http://www.google.com/css/maia.experimental.css").pathname;
// x.substring(x.lastIndexOf("/")+1)

var wrongDomains = {};

for(site of sites) {
  console.log("Processing url: " + site.urls[0]);
  var options = site;
  var url = new URL(site.urls[0]);
  options.directory = "./data";
  if (site.recursive === false) {
    options.defaultFilename = site.urls[0].substring(site.urls[0].lastIndexOf("/")+1);
    options.directory = "./data/" + url.hostname;
    options.filenameGenerator = (resource, options, occupiedFileNames) => {
      return resource.filename;
    }
  } else {
    // options.filenameGenerator = 'bySiteStructure';
    options.filenameGenerator = (resource, options, occupiedFileNames) => {
      var parsedUrl = new URL(resource.url);
      var lastPath = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf("/")+1);
      if (lastPath.indexOf(".") == -1 && parsedUrl.search == "") {
        return parsedUrl.hostname + parsedUrl.pathname + "/index.html";
      }
      return parsedUrl.hostname + parsedUrl.pathname + parsedUrl.search;
    }
    options.urlFilter = (url) => {
      var parsedUrl = new URL(url);
      var currentDomain = parsedUrl.host;
      var goodDomain = false;
      for (domain of domains) {
        if (currentDomain === domain) { 
          goodDomain = true;
          break;
        }
      }
      if (!goodDomain) {
        if (typeof(wrongDomains[currentDomain]) === "undefined") {
          wrongDomains[currentDomain] = currentDomain;
          console.log("Wrong domain:" + currentDomain);
        }
        return false;
      }
      // Check filename!
      for (ext of rejectExtensions) {
        if (parsedUrl.pathname.endsWith(ext)) {
          console.log("Rejecting extension: " + url);
          return false;
        }
      }
      // console.log("Start: " + url);
      return true;
    };
  }
  options.requestConcurrency = 5;
  options.onResourceSaved =  (resource) => {
    console.log(`Done: ${resource.filename}`);
  };
  scrape(options, (error, result) => {
   if (result) {
     console.log("Result: " + result);
   }
   if (error) {
     console.log("Error: " + error);
   }
 });
}
