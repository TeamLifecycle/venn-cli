var program = require('commander');
var chalk = require('chalk');
var inquirer = require("inquirer");
var mkdirp = require("mkdirp");
var async = require("async");
var _ = require("underscore");
fs = require('fs');
var exec = require('child_process').exec;
var args = require('minimist')(process.argv.slice(2));
var spinner = new (require('cli-spinner').Spinner)('Downloading.. %s');
var host = "http://localhost:3000/v1/";
var vars = require("../config/vars");
require("../lib/functions")();
var request = require("request").defaults({
    json: true
});

if(!isLoggedIn()){
  console.log("Must be logged in. Use " + chalk.white.bgBlue.bold("venn login") + " or "+ chalk.white.bgBlue.bold("venn signup") );
  process.exit(1);
}

callback = function(apps) {
  apps.unshift({"name": "Create New App", "value": false});
  inquirer.prompt([
    {
      type: "list",
      name: "app",
      message: "Choose existing Venn app or create new one:",
      choices: apps
    },
    {
      type: "input",
      name: "name",
      message: "What is the name of your project?",
      when: function(answers) {
        return answers.app == false;
      }
    },
    {
      type: "list",
      name: "lang",
      message: "What language is this project?",
      when: function(answers) {
        return answers.app == false;
      },
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
    },
    {
      type: "list",
      name: "framework",
      message: "What NodeJS Framework are you using?",
      choices: [
        {
          name: "Express",
          value: "express"
        },
        {
          name: "Hapi",
          value: "hapi"
        },
        {
          name: "Koa",
          value: "koa"
        },
        {
          name: "Other",
          value: "other"
        }
      ],
      when: function(answers) {
        return answers.lang == "node" && answers.app == false;;
      }
    },
  ], function( answers ) {
      spinner.start();
      async.parallel([
          function(callback){
            if(answers.app) {
              getAppEndpoint = vars["CLI_API_ENDPOINT"]["APP"] + "/" + answers.app.id;
              request.get({
                  url: getAppEndpoint
              }, function(err, response, body) {
                return callback(null, body);
              });
            } else {
              createAppEndpoint = vars["CLI_API_ENDPOINT"]["USER"] + "/" + getVennToken() + "/app";
              request.post({
                  url: createAppEndpoint,
                  body: answers
              }, function(err, response, body) {
                return callback(null, body);
              });
            }
          }
      ],
      function(err, app){
        answers.app = app;
        delete answers.name;
        delete answers.lang;
        delete answers.framework;
        fs.writeFile('.vennconfig', JSON.stringify(answers, null, 2), function (err) {
          if (err) return console.log(err);
            spinner.stop(true);
        });
        console.log("Project created! Add services using " + chalk.white.bgBlue.bold('venn add'));

      });
      
    });
}

spinner.start();
getAppsEndpoint = vars["CLI_API_ENDPOINT"]["USER"] + "/" + getVennToken() + "/apps";
request.get({
    url: getAppsEndpoint
}, function(err, response, body) {
  spinner.stop(true);
  choices = [];
  _.each(body, function(app){
    var obj = {}
    obj.name = app.name;
    obj.value = {
      id: app._id._str,
      name: app.name,
    }
    choices.push(obj);
  });
  callback(choices);
});
