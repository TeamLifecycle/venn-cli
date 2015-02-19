var fs = require("fs");

module.exports = function(){ 
	this.addPropertyToFile = function(filename, propertyName, property){
		obj=eval("("+fs.readFileSync(filename).toString()+")");
		obj[propertyName] = property;
		fs.writeFileSync( filename, JSON.stringify(obj, null, 2) )
	};
	this.capitalize = function (s) {
	    return s[0].toUpperCase() + s.slice(1);
	}
};