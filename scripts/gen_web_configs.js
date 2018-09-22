var fs = require('fs');
var path = require('path');
var domains = require('./domains').domains;
var replace = require('replace-in-file');
var username = process.env.SUDO_USER;
var dir = path.dirname(process.cwd())+'/scratch-gui';

var scratch = {
  files: ['/etc/systemd/system/scratch.service'],
  from: [new RegExp("{USER}", "g"), new RegExp("{DIR}","g")], 
  to: [username, dir],
};

var servers = "";
var dns = "";

for (domain of domains) {
  var newDomain = domain.substring(0, domain.length - 4) + '.local';
  servers += "server {\n";
  servers += `         server_name ${newDomain};\n`;
  servers += `         root /var/www/cs/${domain};\n`;
  servers += `  location / {\n`;
  servers += `      add_header Access-Control-Allow-Origin *;\n`;
  servers += `  }\n`;
  servers += '}\n\n';

  dns += `address=/${domain}/172.31.254.254\n`;
  dns += `address=/${newDomain}/172.31.254.254\n`;

}

var nginx = {
  files: ['/etc/nginx/sites-available/cs'],
  from: "{SERVERS}", 
  to: servers,
};

var dns = {
  files: ['/etc/dnsmasq.d/cs.conf'],
  from: "{DNS}",
  to: dns,
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
replacer(dns);
