secrets = require("./secrets");

module.exports = {

  mixpanel: (function() {
  	return require('mixpanel').init(secrets.MIXPANEL.TOKEN);
  })()

};