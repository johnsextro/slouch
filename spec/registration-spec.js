var registration = require('../authorization/registrationService.js');

describe("Registration", function () {
  it("Check if a site already exists", function () {
	expect(registration.alreadyExists('yo.mama.com')).toBeFalsy();
  });
});