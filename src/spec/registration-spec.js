var mockery = require('mockery');
var httpMocks = require('node-mocks-http');
var redisMock = require('redis-mock');
var client = redisMock.createClient();

describe("Registration", function () {
	var registration = require('../authorization/registrationService.js');

	beforeEach(function() {
		// mockery.registerAllowable('../authorization/registrationService.js');
		// mockery.registerAllowables(['crypto', 'node-mocks-http', 'querystring']);
		// mockery.enable();
		
	});

	afterEach(function() {
		// mockery.disable();
	 //    mockery.deregisterAll();
	});

	it("Passes required data check when all data present", function() {
		var actual = registration.doesKeyReqHaveRequiredData({regData: {email: 'a@b.c', website: 'b.c' }});
		expect(actual).toBe(true);
	});

	it("Fails required data check when body empty", function() {
		expect(registration.doesKeyReqHaveRequiredData({})).toBe(false);
	});

	it("Fails required data check when email empty", function() {
		var actual = registration.doesKeyReqHaveRequiredData({regData: {email: '', website: 'b.c' }});
		expect(actual).toBe(false);
	});

	it("Fails required data check when website empty", function() {
		var actual = registration.doesKeyReqHaveRequiredData({regData: {email: 'a@b.c', website: '' }});
		expect(actual).toBe(false);
	});

	it("Fails required data check when regData is missing", function() {
		var actual = registration.doesKeyReqHaveRequiredData({regData: ''});
		expect(actual).toBe(false);
	});

	it("Create API Key from new site registration", function() {
		var res = httpMocks.createResponse();
		registration.sendApiKey('a@b.c', 'b.c', res, client);
		expect(res._isJSON()).toBe(true);
		var data = JSON.parse(res._getData());
		expect(data.apiKey).toBeDefined();
		client.hget('b.c key', function(err, reply) {
			expect(reply).toBeDefined();
			expect(reply).not.toBeNull();
		});
	});	

	it("When site exists response will be a 500", function() {
		var res = httpMocks.createResponse();
		registration.sendResponseBasedOnSiteExistence(true, 'a@b.c', 'b.c', res, client);
		expect(res.statusCode).toBe(500);
	});

	it("When site exists response will be a 200", function() {
		var res = httpMocks.createResponse();
		registration.sendResponseBasedOnSiteExistence(null, 'oh@oh.mg', 'oh.mg', res, client);
		expect(res.statusCode).toBe(200);
	});

	it("siteExists is false when no site exists", function() {
		var res = httpMocks.createResponse();
		registration.siteExists('new@new.com', 'new.com', res, function(reply, email, siteName, res, client) {
			expect(reply).toBeFalsy();
		}, client);
	});	

	it("siteExists is true when site exists", function() {
		var res = httpMocks.createResponse();
		registration.sendApiKey('x@y.z', 'y.z', res, client);

		registration.siteExists('x@y.z', 'y.z', res, function(reply, email, siteName, res) {
			expect(reply).toBeTruthy();
		}, client);
	});	

	it("apiKey is not registered will respond with 401", function() {
		var res = httpMocks.createResponse();
		registration.sendTokenResponse(null, 'unknownkey', res);
		expect(res.statusCode).toBe(401);
	});

	it("apiKey is registered will respond with token", function() {
		var res = httpMocks.createResponse();
		registration.sendTokenResponse('token', 'registeredKey', res);
		expect(res.statusCode).toBe(200);
		expect(res._isJSON()).toBe(true);
		var data = JSON.parse(res._getData());
		expect(data.token).toBeDefined();
	});	
});