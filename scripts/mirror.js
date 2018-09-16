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

var searchStrings = ['https:', 'scratch.mit.edu', 'www.google.com'];
var replaceStrings = ['http:', 'scratch.local', 'www.google.local'];

var searchRegexes = [];

for (domain of domains) {
  if (domain.endsWith('.com')) {
    var newDomain = domain.substring(0, domain.length - 4) + '.local';
    searchStrings.push(domain); 
    replaceStrings.push(newDomain);
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
  .path('../www/cs')
  .ext(mediaExtensions)
  .not()
  .find((err, files) => {
     processFiles(err, files);
  });
