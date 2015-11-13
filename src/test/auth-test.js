var APIeasy = require('api-easy'),
     assert = require('assert')
  , redis = require('redis')
  , client = redis.createClient();

client.on("error", function (err) {
    console.log("Unable to create a connection to Redis");
    console.log("Install Redis using the default IP: 127.0.0.1 and the default port: 6379");
});

var suite = APIeasy.describe('Registartion');
var expectedApiKey = '';

suite.discuss('Registration API')
	.use('localhost', 3000)
	.setHeader('Content-Type', 'application/json')
	.discuss('401 Unauthorized status when the requestors key is not found')
	.post('/register/request-token', { key: 'invalid' })
		.expect(401)
	.undiscuss();

suite.discuss('the request-key endpoint should respond with a 400 Bad Request')
	.discuss('status when insufficient information was provided to register the new key')
	.post('/register/request-key')
		.expect(400)
	.undiscuss().undiscuss();

suite.discuss('the request-key endpoint should respond with a 200 and the new key')
	.discuss('when a new key is successfully registered')
	.post('/register/request-key', {regData: {email: 'john.sextro@gmail.com', website: 'http://johnsextro.com'}})
		.expect(200)
	    .expect('should respond with a new key', function (err, res, body) {
           assert.isNotNull(body);
           var retVal = JSON.parse(body) 
           this.expectedApiKey = retVal.apiKey
           assert.ok(retVal.apiKey)
           suite.before('setApiKey', function(outgoing) {
                outgoing.body = outgoing.body.replace('_API_KEY', retVal.apiKey)
                return outgoing;
            })
    	})
	.next()
	.post('/register/request-token', {key: '_API_KEY'})
		.expect(200)
	.undiscuss().undiscuss();


suite.discuss('the request-key endpoint should respond with a 200')
	.discuss('when a second request is made')
	.post('/register/request-key', {regData: {email: 'john.sextro@gmail.com', website: 'http://9principles.com'}})
		.expect(200)
	.undiscuss().undiscuss()
	.next()
	.discuss('the register-key endpoint should respond with a 500')
	.discuss('when a second request is made to register the same site')
	.post('/register/request-key', {regData: {email: 'john.sextro@gmail.com', website: 'http://9principles.com'}})
		.expect(500)
	.undiscuss().undiscuss();

client.flushdb();
client.quit();
suite.export(module);