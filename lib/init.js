// console.log("venn init");

var program = require('commander');
var chalk = require('chalk');
var inquirer = require("inquirer");
var args = require('minimist')(process.argv.slice(2));

// validate
projectName = args.n;
if (!projectName || !projectName.length) return console.log("must include name with 'venn init -n project-name'");

inquirer.prompt([
  {
    type: "list",
    name: "type",
    message: "What type of project?",
    choices: [
      {
        name: "NodeJS Express REST API",
        value: "node-express-api"
      },
      {
        name: "NodeJS Express Webapp",
        value: "node-express-webapp"
      }
    ]
  }
], function( answers ) {
    console.log(answers.type);
    // TODO download boilerplate code via git clone
    // TODO create vennfile with projectName
    console.log("Project created! Add services using " + chalk.white.bgBlue.bold('venn add'));
  });
