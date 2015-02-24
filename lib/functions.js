var fs = require("fs");

module.exports = function(){ 
	this.addPropertyToFile = function(filename, propertyName, property){
		obj=eval("("+fs.readFileSync(filename).toString()+")");
		obj[propertyName] = property;
		fs.writeFileSync( filename, JSON.stringify(obj, null, 2) )
	};
	this.createFile = function (filename, data) {
	    fs.writeFileSync( filename, data );
	}	
	this.capitalize = function (s) {
	    return s[0].toUpperCase() + s.slice(1);
	}
	this.getVennTokenPath = function() {
		return getUserHome() + "/.venntoken";
	}
	this.getVennToken = function() {
		try {
			var file = fs.readFileSync(getVennTokenPath())
			if(file) return file.toString();
			return false;
		} catch (e) {
			return false;
		}
	}
	this.removeVennToken = function() {
		fs.unlinkSync(getVennTokenPath());
	}
	this.isLoggedIn = function() {
		if(getVennToken()) return true;
		return false;
	}
	this.getUserHome = function() {
	  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
	}
};