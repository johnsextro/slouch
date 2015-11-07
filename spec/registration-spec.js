var mockery = require('mockery');
var httpMocks = require('node-mocks-http');
var redisMock = require('redis-mock');
var client = redisMock.createClient();

describe("Registration", function () {
	var registration;

	beforeEach(function() {
		mockery.registerAllowable('../authorization/registrationService.js');
		mockery.registerAllowables(['crypto', 'node-mocks-http']);
		mockery.registerMock('redis', redisMock);
		mockery.registerMock('client', client);
		mockery.enable();
		registration = require('../authorization/registrationService.js');
	});

	afterEach(function() {
		mockery.disable();
	    mockery.deregisterAll();
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

	it("Create API Key from new site registration", function(done) {
		var res = httpMocks.createResponse();
		registration.sendApiKey('a@b.c', 'b.c', res);
		expect(res._isJSON()).toBe(true);
		var data = JSON.parse(res._getData());
		expect(data.apiKey).toBeDefined();
		client.get('b.c', function(err, reply) {
			expect(reply).toBeDefined();
			expect(reply).not.toBeNull();
			done();
		});
	});	

	it("When site exists will get a 500", function() {
		var res = httpMocks.createResponse();
		registration.sendResponseBasedOnSiteExistence(true, 'a@b.c', 'b.c', res);
		expect(res.statusCode).toBe(500);
	});

	it("siteExists is false when no site exists", function(done) {
		var res = httpMocks.createResponse();
		registration.siteExists('new@new.com', 'new.com', res, function(reply, email, siteName, res) {
			expect(reply).toBeFalsy();
			done();
		});
	});	

});