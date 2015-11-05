var mockery = require('mockery');
var httpMocks = require('node-mocks-http');
var redisMock = require('redis-mock');
var client = redisMock.createClient();
var res = httpMocks.createResponse();

describe("Registration", function () {
	var registration;

	beforeAll(function() {
		mockery.registerAllowable('../authorization/registrationService.js');
		mockery.registerAllowables(['crypto', 'node-mocks-http']);
		mockery.registerMock('redis', redisMock);
		mockery.registerMock('client', client);
		mockery.enable();
		registration = require('../authorization/registrationService.js');
	});

	afterAll(function() {
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

	it("Get success response from new site registration", function() {
		// var r = redisMock.createClient();
		// r.set('b.c', '124', function (err ,result) {
		// 	r.get("b.c", function (err, result) {
		// 		console.log(result);
		// 		expect(result).toEqual('124');
		// 	});			
		// });
		registration.sendResponseBasedOnSiteExistence('a@b.c', 'b.c', res);
		expect(res.statusCode).toEqual(200);
		client.get("b.c", function (err, result) {
			expect(result.length).toBeGreater(12);
		});			
	});	
});