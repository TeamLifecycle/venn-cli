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
    type: "password-hidden",
    name: "password",
    message: "Enter a password:",
    validate: function(value) {
      re = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  	  valid = re.test(value);
      if (valid) {
        return true;
      } else {
        return "Please enter password containing at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number";
      }
    }
  }], function( answers ) {
	inquirer.prompt([
	  {
	    type: "password-hidden",
	    name: "passwordconfirm",
	    message: "Confirm password:",
        validate: function(value) {
            if (value && value == answers.password) {
                return true;
            } else {
                return "Password's dont match";
            }
        }
	  }], function( answers2 ) {
	  	spinner.start();
	  	endpoint = vars["CLI_API_ENDPOINT"]["SIGNUP"];
	  	answers.registrationCode = "9b87dec2d192a116e6067dad";
	  	request.post({
            url: endpoint,
            body: answers
        }, function(err, response, body) {
        	spinner.stop(true);
        	if(response.statusCode >= 400) {
        		if(body.indexOf("Email already exists") > -1) {
        			console.log("Email already exists!");
        		} else {
        			console.log("Something went wrong! Please try again");
        		}
        	} else {
        		console.log("Account created! You are now logged in");
        		createFile( getVennTokenPath(), body.token);
        	}
        	process.exit(1);
        });
	  }
	);

  }
);