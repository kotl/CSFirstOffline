
var generateFilename = function (url) {
      var parsedUrl = new URL(url);
      var lastPath = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf("/")+1);
      if (lastPath.indexOf(".") == -1 && parsedUrl.search == "") {
        return parsedUrl.hostname + decodeURI(parsedUrl.pathname) + "/index.html";
      }
      return parsedUrl.hostname + decodeURI(parsedUrl.pathname) + parsedUrl.search;
};

exports.generateFilename = generateFilename;
