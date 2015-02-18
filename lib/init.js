// console.log("venn init");

var program = require('commander');
var chalk = require('chalk');
var inquirer = require("inquirer");
fs = require('fs');
var exec = require('child_process').exec;
var args = require('minimist')(process.argv.slice(2));
var spinner = new (require('cli-spinner').Spinner)('Downloading.. %s');
var host = "http://localhost:3000/v1/";

// validate
projectName = args.n;
if (!projectName || !projectName.length) return console.log("must include name with " + chalk.white.bgBlue.bold("venn init -n project-name") );

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
    spinner.start()
    // TODO download boilerplate code via git clone
    exec("git clone https://github.com/VennHQ/express-coffee-mocha-boilerplate.git " + projectName, function (error, stdout, stderr) {
      // TODO create vennfile with projectName
      data = {
        name: projectName,
        type: answers.type
      }
      fs.writeFile(projectName + '/venn-config.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return console.log(err);
        spinner.stop(true);
      });
    });
    console.log("Project created! Add services using " + chalk.white.bgBlue.bold('venn add'));
  });
