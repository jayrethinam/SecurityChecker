// Generated by CoffeeScript 1.7.1
var checkflavor, exec, execute, fs, linuxflavors, securityCheck, ubuntuSecurityCheck, util;

exec = require('child_process').exec;

fs = require('fs');

util = require('util');

linuxflavors = ["ubuntu", "debian", "centos"];

this.ostype = 'unknown';

this.osflavor = 'unknown';

execute = function(command, callback) {
  return exec(command, (function(_this) {
    return function(error, stdout, stderr) {
      var errOutput, stdOutput;
      if (error != null) {
        return callback(new Error("Execution failed"));
      }
      if (stdout !== null) {
        String(stdOutput = stdout.toString());
      }
      if (stderr !== null) {
        String(errOutput = stderr.toString());
      }
      return callback(null, stdOutput, errOutput);
    };
  })(this));
};

checkflavor = function(callback) {
  var contents, val, _i, _len;
  this.ostype = require('os').type();
  if (fs.existsSync('/etc/lsb-release') === true) {
    contents = fs.readFileSync('/etc/lsb-release', 'utf8');
    for (_i = 0, _len = linuxflavors.length; _i < _len; _i++) {
      val = linuxflavors[_i];
      if (contents.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
        this.osflavor = val;
      }
    }
    console.log("OS: " + this.ostype + ", Flavor: " + this.osflavor);
    return callback(null);
  }
};

ubuntuSecurityCheck = function(callback) {
  var command;
  command = "/usr/lib/update-notifier/apt-check --human-readable";
  return execute(command, function(error, output, erroutput) {
    var i, pkgvars, securitvars, tmparr, _i, _len;
    if (error instanceof Error) {
      return console.log("received Error while executing the command - ", command);
    }
    console.log("Execution success :  output is ", output);
    console.log("Execution success :  Error print  is ", erroutput);
    tmparr = [];
    tmparr = output.split("\n");
    for (_i = 0, _len = tmparr.length; _i < _len; _i++) {
      i = tmparr[_i];
      util.log("i value " + i);
    }
    pkgvars = tmparr[0].split(/[ ]+/);
    securitvars = tmparr[1].split(/[ ]+/);
    this.result = {
      "os": ostype,
      "flavor": osflavor,
      "PackagesTobeInstalled": {
        "TotalPackages": pkgvars[0],
        "securityPackages": securitvars[0]
      }
    };
    return callback(this.result);
  });
};

securityCheck = function(callback) {
  return checkflavor(function() {
    if (ostype !== "Linux") {
      return callback(new Error("OS is not Linux... Security Check is supported only in Linux "));
    }
    switch (osflavor) {
      case "ubuntu":
        ubuntuSecurityCheck((function(_this) {
          return function(result) {};
        })(this));
        return callback(result);
      default:
        return callback({
          OS: ostype,
          flavor: osflavor
        });
    }
  });
};

module.exports.securityCheck = securityCheck;
