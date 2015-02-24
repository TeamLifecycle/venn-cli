require("./functions")();

if(isLoggedIn()) return console.log("Logged in.");
return console.log("Logged out.");