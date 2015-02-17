// console.log("venn init");

var program = require('commander');
var chalk = require('chalk');
var inquirer = require("inquirer");
var args = require('minimist')(process.argv.slice(2));

inquirer.prompt([
  {
    type: "list",
    name: "integration",
    message: "What integration do you want to add?",
    choices: [
      {
        name: "Mixpanel (Node)",
        value: "node-mixpanel"
      },
      {
        name: chalk.gray("Stripe (Node) - coming soon"),
        value: "node-stripe",
        disabled: {}
      },
      {
        name: chalk.gray("Dropbox (Node) - coming soon"),
        value: "node-dropbox",
        disabled: {}
      }
    ]
  },
  {
    type: "input",
    name: "username",
    message: "What's your login?",
    validate: function( value ) {
      // var pass = value.match(/^([01]{1})?[\-\.\)?$/i);
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
    // console.log(answers);
    // TODO verify username/pw
    // TODO get keys
    // TODO add keys to keys file
    // TODO init to initalize file
    console.log("Service added, keys configured, ready to go!");
    console.log("Import service with: " + chalk.white.bgBlue.bold('stripe = require ("/config/imports").stripe') );;
    console.log("Then, use it: " + chalk.white.bgBlue.bold('stripe.customers.create ...') );
  });
