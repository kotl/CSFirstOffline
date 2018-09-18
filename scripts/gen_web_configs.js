var fs = require('fs');
var path = require('path');
var domains = require('./domains').domains;
var replace = require('replace-in-file');
var username = process.env.SUDO_USER;
var dir = process.cwd();

var scratch = {
  files: ['/etc/systemd/system/scratch.service'],
  from: [new RegExp("{USER}", "g"), new RegExp("{DIR}","g")], 
  to: [username, dir],
};

var servers = "";

for (domain of domains) {
  var newDomain = domain.substring(0, domain.length - 4) + '.local';
  servers += "server {\n";
  servers += `         server_name ${newDomain}\n`;
  servers += `         root /var/www/cs/${domain}\n`;
  servers += '}\n\n';
}


var nginx = {
  files: ['/etc/nginx/sites-available/cs'],
  from: "{SERVERS}", 
  to: servers,
};

var replacer = (options) => {
    replace(options, (error, changes) => {
      if (error) {
        console.log('Error occurred:', error);
      }
      for (c of changes) {
        console.log('Modified: ' + c);
      }
    });
};

replacer(scratch);
replacer(nginx);
