var mockery = require('mockery');
var httpMocks = require('node-mocks-http');
var redisMock = require('redis-mock');
var client = redisMock.createClient();

describe("Registration", function () {
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
		registration.sendApiKey('a@b.c', 'b.c', res);
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
		registration.sendResponseBasedOnSiteExistence(true, 'a@b.c', 'b.c', res);
		expect(res.statusCode).toBe(500);
	});

	it("When site exists response will be a 200", function() {
		var res = httpMocks.createResponse();
		registration.sendResponseBasedOnSiteExistence(null, 'oh@oh.mg', 'oh.mg', res);
		expect(res.statusCode).toBe(200);
	});

	it("siteExists is false when no site exists", function() {
		var res = httpMocks.createResponse();
		registration.siteExists('new@new.com', 'new.com', res, function(reply, email, siteName, res) {
			expect(reply).toBeFalsy();
		});
	});	

	it("siteExists is true when site exists", function() {
		var res = httpMocks.createResponse();
		registration.sendApiKey('x@y.z', 'y.z', res);

		registration.siteExists('x@y.z', 'y.z', res, function(reply, email, siteName, res) {
			expect(reply).toBeTruthy();
		});
	});	

	it("Call to requestKey returns 200 when data for new site supplied", function() {
		var req = httpMocks.createRequest({
			method: 'POST',	url: '/register/request-key', 
			body: {regData: {email: 'john.sextro@gmail.com', website: 'http://johnsextro.com'}}
		});
		var res = httpMocks.createResponse();
		registration.requestKey(req, res);
		expect(res.statusCode).toBe(200);
	});

	it("Call to requestKey returns 400 when missing required data", function() {
		var req = httpMocks.createRequest({
			method: 'POST',	url: '/register/request-key', 
			body: {regData: {email: 'john.sextro@gmail.com', website: ''}}
		});
		var res = httpMocks.createResponse();
		registration.requestKey(req, res);
		expect(res.statusCode).toBe(400);
	});

	it("Call to requestToken returns 400 when missing key", function() {
		var req = httpMocks.createRequest({
			method: 'POST',	url: '/register/request-token', 
			body: {key: ''}
		});
		var res = httpMocks.createResponse();
		registration.requestToken(req, res);
		expect(res.statusCode).toBe(400);
	});

	it("Call to requestToken returns 401 when key is invalid", function() {
		var req = httpMocks.createRequest({
			method: 'POST',	url: '/register/request-token', 
			body: {key: 'notvalid'}
		});
		var res = httpMocks.createResponse();
		registration.requestToken(req, res);
		expect(res.statusCode).toBe(401);
	});

	it("Call to requestToken returns the token when request valid key supplied", function() {
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