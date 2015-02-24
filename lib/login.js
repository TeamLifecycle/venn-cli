var inquirer = require("inquirer");
var request = require("request").defaults({
    json: true
});
var vars = require("../config/vars");
require("./functions")();
var exec = require('child_process').exec;
var spinner = new(require('cli-spinner').Spinner)('Downloading.. %s');

inquirer.prompt([
  {
    type: "input",
    name: "email",
    message: "Enter your email address:",
    validate: function(value) {
      re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	  valid = re.test(value);
      if (valid) {
        return true;
      } else {
        return "Please enter valid email address";
      }
    }
  },
  {
    type: "password",
    name: "password",
    message: "Enter a password:"
  }], function( answers ) {
	
	  	spinner.start();
	  	endpoint = vars["CLI_API_ENDPOINT"]["LOGIN"];
	  	request.post({
            url: endpoint,
            body: answers
        }, function(err, response, body) {
        	spinner.stop(true);
        	if(response.statusCode >= 400) {
      			console.log("Invalid login!");
        	} else {
        		console.log("Logged in!");
        		createFile( getVennTokenPath(), body.token);
        	}
        	process.exit(1);
        });
	  


  }
);