var fs = require('fs');
var path = require('path');
var domains = require('./domains').domains;
var replace = require('replace-in-file');
var FileHound = require('filehound');

var textExtensions = [
  'html',
  'css',
  'js',
  'txt',
];

var mediaExtensions = [
    'pdf',
    'ttf',
    'png',
    'gif',
    'jpg',
    'vtt',
    'mp4',
    'jpeg',
    'tiff',
    'ico',
];

var searchStrings = [
    'https://scratch.mit.edu/projects/(.*?)/',
    'http://scratch.mit.edu/projects/(.*?)/',
    'http://scratch.local/projects/(.*?)/',
    'https:', 
    'https://scratch.mit.edu', 
    'http://scratch.mit.edu', 
    'https://www.google.com',
    "'//www.google-analytics.com",
];
var replaceStrings = [
    'http://scratch.local/#project$1"',
    'http://scratch.local/#project$1"',
    'http://scratch.local/#project$1"',
    'http:', 
    'http://scratch.local', 
    'http://scratch.local',
    'http://www.google.local',
    "'http://www.google-analytics.local",
];

var searchRegexes = [];

for (domain of domains) {
  if (domain.endsWith('.com')) {
    var newDomain = domain.substring(0, domain.length - 4) + '.local';
    searchStrings.push("http://" + domain); 
    replaceStrings.push("http://" + newDomain);

    searchStrings.push("https://" + domain); 
    replaceStrings.push("http://" + newDomain);
  }
}

for (s of searchStrings) {
  searchRegexes.push(new RegExp(s, 'g'));
}

var processFiles = function (err, files)  {
    if (err) return console.error(err);
    var options = {
      files: files,
      from: searchRegexes,
      to: replaceStrings,
    };
    console.log("Options: "+ JSON.stringify(options));
    replace(options, (error, changes) => {
      if (error) {
        console.log('Error occurred:', error);
      }
      for (c of changes) {
        console.log('Modified: ' + c);
      }
    });

};

FileHound.create()
  .path('./')
  .ext(mediaExtensions)
  .not()
  .find((err, files) => {
     processFiles(err, files);
  });
