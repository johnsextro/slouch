express = require('express');

exports.init = function() {
	var app = module.exports = express.createServer();

	// Configuration
	app.configure('development', function(){
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	  app.use(express.logger('dev'));
	});

	app.configure('test', function(){
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	  app.use(express.logger('short'));
	});

	app.configure('production', function(){
	  app.use(express.errorHandler());
	  app.use(express.logger('tiny'));
	});

	return app;
}