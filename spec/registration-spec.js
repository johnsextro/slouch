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

	it("Get success response from new site registration", function(done) {
		var res = httpMocks.createResponse();
		registration.sendResponseBasedOnSiteExistence('a@b.c', 'b.c', res);
		// registration.hello(res);
		done();
		console.error(JSON.parse(res._getData()));
		expect(res._isJSON()).toBe(true);
	});	
});