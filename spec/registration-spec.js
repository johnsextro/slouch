var registration = require('../authorization/registrationService.js');

describe("Registration", function () {
	it("Check if a site already exists", function () {
		expect(registration.siteAlreadyRegistered('yo.mama.com')).toBeFalsy();
	});

	it("Calculate a new crypto based API key", function() {
		var APIKey = registration.calcApiKey('a@b.c', 'b.c');
		expect(APIKey).toBeTruthy;
		expect(APIKey.length).toBeGreaterThan(10);
	});

	it("Ensure required data exist to calculate a new API key", function() {
		expect(registration.reqHasRequiredData({})).toBeFalsy;
		expect(registration.reqHasRequiredData({body: {regData: {email: 'a@#b.c', website: 'b.c'}}})).toBeTruthy;
	});
});