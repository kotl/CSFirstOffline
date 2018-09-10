var scrape = require('website-scraper');
var path = require('path');
var fs = require('fs');

var stream = fs.createWriteStream("cs/download.sh");

var sites = [
/* { urls: ["http://www.google.com/css/maia.experimental.css"], recursive: false},
 { urls: ["http://www.google.com/js/google.js"], recursive: false},
 { urls: ["http://www.google.com/js/maia.js"], recursive: false},
 { urls: ["http://js-agent.newrelic.com/nr-632.min.js"], recursive: false},
 { urls: ["http://fonts.googleapis.com/css?family=Open+Sans+Condensed:700,300"], recursive: false},
 { urls: ["http://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900"], recursive: false},*/
  { urls: ["https://csfirst.withgoogle.com/c/cs-first/en/curriculum.html"], recursive: true, maxRecursiveDepth: 5},
//  { urls: ["https://csfirst.withgoogle.com/c/cs-first/en/storytelling/dialogue/introduction-to-dialogue-and-sequencing.html"], 
//    recursive: true, maxRecursiveDepth: 2},
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
  "/user",
  "/dashboard",
  "/teacher_support",
];

var rejectExtensions = [
  ".ogv",
  ".zip",
];

var externalDownloadExtensions = [
  ".mp4",
];

var options = {
  urls: ['http://nodejs.org/'],
  directory: '/path/to/save/',
};

// var x = new URL(" http://www.google.com/css/maia.experimental.css").pathname;
// x.substring(x.lastIndexOf("/")+1)

var wrongDomains = {};

var generateFilename = function (url) {
      var parsedUrl = new URL(url);
      var lastPath = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf("/")+1);
      if (lastPath.indexOf(".") == -1 && parsedUrl.search == "") {
        return parsedUrl.hostname + parsedUrl.pathname + "/index.html";
      }
      return parsedUrl.hostname + parsedUrl.pathname + parsedUrl.search;
};

stream.once('open', function(fd) {

for(site of sites) {
  console.log("Processing url: " + site.urls[0]);
  var options = site;
  var url = new URL(site.urls[0]);
  options.directory = "./cs/sites";
  if (site.recursive === false) {
    options.defaultFilename = site.urls[0].substring(site.urls[0].lastIndexOf("/")+1);
    options.directory = "./cs/sites" + url.hostname;
    options.filenameGenerator = (resource, options, occupiedFileNames) => {
      return resource.filename;
    }
  } else {
    options.filenameGenerator = (resource, options, occupiedFileNames) => {
      return generateFilename(resource.url);
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
          console.log("Rejected domain:" + currentDomain);
        }
        return false;
      }
      for (d of excludeDirectories) {
        if (parsedUrl.pathname.startsWith(d)) {
          // console.log("Rejecting directory: " + url);
          return false;
        }
      }
      // Check filename!
      for (ext of rejectExtensions) {
        if (parsedUrl.pathname.endsWith(ext)) {
          console.log("Rejecting extension: " + url);
          return false;
        }
      }
      for (ext of externalDownloadExtensions) {
        if (parsedUrl.pathname.endsWith(ext)) {
          var file = generateFilename(url);
          var dir = path.dirname(file);
          stream.write(`mkdir -p '${dir}'\nwget -c -nc '${url}' -O '${file}'\n`);
          console.log("Save later: " + url);
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
});
