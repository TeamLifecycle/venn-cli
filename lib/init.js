// console.log("venn init");

var program = require('commander');
var chalk = require('chalk');
var inquirer = require("inquirer");
var mkdirp = require("mkdirp");
fs = require('fs');
var exec = require('child_process').exec;
var args = require('minimist')(process.argv.slice(2));
var spinner = new (require('cli-spinner').Spinner)('Downloading.. %s');
var host = "http://localhost:3000/v1/";

// validate
// projectName = args.n;
// if (!projectName || !projectName.length) return console.log("must include name with " + chalk.white.bgBlue.bold("venn init -n project-name") );

inquirer.prompt([
  {
    type: "input",
    name: "name",
    message: "What is the name of your project?"
  }
  ,
  {
    type: "list",
    name: "lang",
    message: "What language is this project?",
    choices: [
      {
        name: "NodeJS",
        value: "node"
      },
      {
        name: "Python",
        value: "python"
      },
      {
        name: "Ruby",
        value: "ruby"
      },
      {
        name: "Php",
        value: "php"
      },
      {
        name: "Objective-C/iOS",
        value: "ios"
      },
      {
        name: "Java/Android",
        value: "android"
      }
    ]
  }
], function( answers ) {
    spinner.start()
    // TODO download boilerplate code via git clone
    // exec("git clone https://github.com/VennHQ/express-coffee-mocha-boilerplate.git " + projectName, function (error, stdout, stderr) {
      // TODO create vennfile with projectName
    data = {
      name: answers.name,
      lang: answers.lang
    }
    // fs.writeFile(projectName + 'venn-config.json', JSON.stringify(data, null, 2), function (err) {
    fs.writeFile('venn-config.json', JSON.stringify(data, null, 2), function (err) {
      if (err) return console.log(err);
      mkdirp('config', function(err) {
        fs.writeFile('config/secrets.json', "{}");
        spinner.stop(true);
      });
    });
    // });
    console.log("Project created! Add services using " + chalk.white.bgBlue.bold('venn add'));
  });
