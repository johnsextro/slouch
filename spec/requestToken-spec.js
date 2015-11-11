var mockery = require('mockery');
var httpMocks = require('node-mocks-http');
var redisMock = require('redis-mock');
var client = redisMock.createClient();

describe("Request token", function () {
	var registration;

	beforeEach(function() {
		mockery.registerAllowable('../authorization/registrationService.js');
		mockery.registerAllowables(['crypto', 'node-mocks-http', 'querystring']);
		mockery.registerMock('redis', redisMock);
		mockery.registerMock('client', client);
		mockery.enable();
		registration = require('../authorization/registrationService.js');
	});

	afterEach(function() {
		mockery.disable();
	    mockery.deregisterAll();
	});

	// it("spike", function(done) {
	// 	var apiKey = '12345ABC';
		
	// 	client.get(apiKey, function(err, reply) {
	// 		console.log(typeof reply);
	// 		console.log(reply);
	// 		if(reply !== null) {
	// 			console.error('found');
	// 		} else {
	// 			console.error('not found');
	// 		}
	// 		done();
	// 	});
	// });

	it("Call to requestToken returns 401 when key is invalid", function() {
		var req = httpMocks.createRequest({
			method: 'POST',	url: '/register/request-token', 
			body: {key: 'notvalid'}
		});
		var res = httpMocks.createResponse();
		registration.requestToken(req, res);
		expect(res.statusCode).toBe(401);
	});

	it("Call to requestToken returns the token when valid key supplied", function() {
		var keyResponse = httpMocks.createResponse();
		registration.sendApiKey('test@test.123', 'test.123', keyResponse);
		var data = JSON.parse(keyResponse._getData());
		var apiKey = data.apiKey;

		var req = httpMocks.createRequest({
			method: 'POST',	url: '/register/request-token', 
			body: {key: apiKey }
		});
		var res = httpMocks.createResponse();
		registration.requestToken(req, res);
		expect(res.statusCode).toBe(200);
		var data = JSON.parse(res._getData());
		expect(data.token).toBeDefined();

	});
});