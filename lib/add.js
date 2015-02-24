// console.log("venn init");
var program = require('commander');
var chalk = require('chalk');
var inquirer = require("inquirer");
var fs = require("fs");
var request = require("request").defaults({
    json: true
});
var vars = require("../config/vars");
var exec = require('child_process').exec;
var spinner = new(require('cli-spinner').Spinner)('Downloading.. %s');
require("../lib/functions")();
var mkdirp = require('mkdirp');

// ensure venn-config.json exists
if (!fs.existsSync("./venn-config.json")) {
    console.info("Venn has not been initialized. Please use: " + chalk.white.bgBlue.bold("venn init -n project-name"));
    process.exit(1);
}

var projectName = JSON.parse(fs.readFileSync('venn-config.json', 'utf8'))["name"];

inquirer.prompt({
    type: "list",
    name: "integration",
    message: "What integration do you want to add?",
    choices: [{
        name: "Mixpanel (Node)",
        value: {
          route: "node/mixpanel",
          name: "Mixpanel"
        }
    }, {
        name: chalk.gray("Stripe (Node) - coming soon"),
        value: "node/stripe",
        disabled: {}
    }, {
        name: chalk.gray("Dropbox (Node) - coming soon"),
        value: "node/dropbox",
        disabled: {}
    }]
}, function(answers1) {
    inquirer.prompt([{
        type: "input",
        name: "username",
        message: "What's your "
          .concat(answers1.integration.name)
          .concat(" login?"),
        validate: function(value) {
            if (value && value.length) {
                return true;
            } else {
                return "Please enter a valid login";
            }
        }
    }, {
        type: "password",
        name: "password",
        message: "What's your password?",
        validate: function(value) {
            if (value && value.length) {
                return true;
            } else {
                return "Please enter a password";
            }
        }
    }], function(answers) {
        // TODO send language/integration, username, password
        spinner.start();
        answers.project = projectName;
        endpoint = vars["CLI_API_ENDPOINT"]["ROOT"] + "/" + answers1.integration.route;
        var start = new Date();
        request.post({
            url: endpoint,
            body: answers
        }, function(err, response, body) {
            console.log(((new Date() - start) / 1000), " seconds");
            if (response.statusCode >= 400) {
                spinner.stop(true);
                console.error(body.error);
                process.exit(1);
            } else {
                // create config folder
                
                    // TODO add keys to keys file
                    addPropertyToFile("config/secrets.json", body.keys.name, body.keys.value);
                    // TODO init to initalize file
                    // TODO install from npm, etc.
                    exec(body["install-cmd"], function (error, stdout, stderr) {
                        spinner.stop(true);
                        console.info("Service added, keys configured, ready to go!");
                        console.info("Import service with: " + chalk.white.bgBlue.bold('mixpanel = require ("/config/imports").mixpanel'));;
                        console.info("Then, use it: " + chalk.white.bgBlue.bold('mixpanel.track("played_game");'));
                        process.exit(1);
                    });
                // });
            }
        });
    });
});