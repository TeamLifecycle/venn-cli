#! /usr/bin/env node
'use strict';

/*
 * venn-cli
 * https://github.com/VennHQ/venn-cli
 *
 * Copyright (c) 2015 Tim Giblin
 * Licensed under the MIT license.
 */

var args = require('minimist')(process.argv.slice(2));

var route = args["_"][0];
try {
	require("./"+route+".js");
} catch (e) {
	require("./help.js");
}