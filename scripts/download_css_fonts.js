var fs = require('fs');
var path = require('path');
var parseCssUrls = require('css-url-parser');
var streamDownload = fs.createWriteStream("./download_fonts.sh");
var generateFilename = require('./generate_file').generateFilename;

var DIR = 'cs/fonts.googleapis.com';

fs.readdir(DIR, function(err, items) {
  for (item of items) {
    var css =  fs.readFileSync(DIR + '/' + item, 'utf8');
    var cssUrls = parseCssUrls(css);
    for (url of cssUrls) {
      url = url.replace("fonts.gstatic.local", "fonts.gstatic.com");

      var file = generateFilename(url);
      var dir = path.dirname(file);
      streamDownload.write(`mkdir -p '${dir}'\nwget -c -nc '${url}' -O '${file}'\n`);
    }
  }
});
