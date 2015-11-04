var registration = require('../authorization/registrationService.js');

describe("Registration", function () {
	it("Check for new site is false", function () {
		expect(registration.isSiteAlreadyRegistered('yo.mama.com')).toBe(false);
	});

	it("Check for existing site is true", function () {
		registration.calculateApiKey('a@b.c', 'yo.mama.com');
		expect(registration.isSiteAlreadyRegistered('yo.mama.com')).toBe(true);
	});

	it("Calculate a new crypto based API key", function() {
		var APIKey = registration.calculateApiKey('a@b.c', 'b.c');
		expect(APIKey).toBeTruthy;
		expect(APIKey.length).toBeGreaterThan(10);
	});

	it("Passes required data check when all data supplied", function() {
		var actual = registration.doesKeyReqHaveRequiredData({regData: {email: 'a@b.c', website: 'b.c'}});
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
});