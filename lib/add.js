// console.log("venn init");

var program = require('commander');
var chalk = require('chalk');
var inquirer = require("inquirer");
var fs = require("fs");
var request = require("request").defaults({json: true});
var vars = require("../config/vars");
var spinner = new (require('cli-spinner').Spinner)('Downloading.. %s');
var args = require('minimist')(process.argv.slice(2));

// ensure venn-config.json exists
if (!fs.existsSync("./venn-config.json")) {
  console.log("Venn has not been initialized. Please use: " + chalk.white.bgBlue.bold("venn init -n project-name") );
  process.exit(1);
}

var projectName = JSON.parse( fs.readFileSync('venn-config.json', 'utf8') )["name"];

inquirer.prompt([
  {
    type: "list",
    name: "integration",
    message: "What integration do you want to add?",
    choices: [
      {
        name: "Mixpanel (Node)",
        value: "node/mixpanel"
      },
      {
        name: chalk.gray("Stripe (Node) - coming soon"),
        value: "node/stripe",
        disabled: {}
      },
      {
        name: chalk.gray("Dropbox (Node) - coming soon"),
        value: "node/dropbox",
        disabled: {}
      }
    ]
  },
  {
    type: "input",
    name: "username",
    message: "What's your login?",
    validate: function( value ) {
      if (value && value.length) {
        return true;
      } else {
        return "Please enter a valid login";
      }
    }
  },
  {
    type: "password",
    name: "password",
    message: "What's your password?",
    validate: function( value ) {
      if (value && value.length) {
        return true;
      } else {
        return "Please enter a password";
      }
    }
  }
], function( answers ) {
    // TODO send language/integration, username, password
    spinner.start()
    answers.project = projectName;
    endpoint = vars["CLI_API_ENDPOINT"] + "/" + answers.integration;
    console.log("calling endpoint:");
    console.log(endpoint);
    request.post({ url: endpoint, body: answers}, function (err, response, body) {
      console.log("status", response.statusCode);
      console.log("err", err);
      console.log("body", body);
      // if error, show error
      if(response.statusCode >= 400) {
        spinner.stop(true);
        return console.log(body.error);
      } else {
        // TODO add keys to keys file
        // TODO init to initalize file
        spinner.stop(true);
        console.log("Service added, keys configured, ready to go!");
        console.log("Import service with: " + chalk.white.bgBlue.bold('stripe = require ("/config/imports").stripe') );;
        console.log("Then, use it: " + chalk.white.bgBlue.bold('stripe.customers.create ...') );
        process.exit(1);
      }
    });
  });
