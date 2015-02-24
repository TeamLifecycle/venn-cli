var inquirer = require("inquirer");

if(!isLoggedIn()){
  console.log("Must be logged in. Use " + chalk.white.bgBlue.bold("venn login") + " or "+ chalk.white.bgBlue.bold("venn signup") );
  process.exit(1);
}

inquirer.prompt([
  {
    type: "checkbox",
    message: "Choose integrations you want to configure:",
    name: "integrations",
    choices: [
      {
        name: "Google"
      },
      {
        name: "Factual"
      },
      {
        name: "Facebook"
      },
      {
        name: "Foursquare"
      },
      {
        name: "Yelp"
      }
    ],
    validate: function( answer ) {
      if ( answer.length < 1 ) {
        return "You must choose at least one to configure.";
      }
      return true;
    }
  }
], function( answers ) {
  console.log( JSON.stringify(answers, null, "  ") );
});