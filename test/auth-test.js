var APIeasy = require('api-easy'),
     assert = require('assert');

var suite = APIeasy.describe('authorize');

suite.undiscuss().undiscuss()
	.discuss('When using the vouch-score')
	.discuss('authorize endpoint')
	.use('localhost', 3000)
	.setHeader('Content-Type', 'application/json')
	.discuss('auth token when the requestors key is verified')
	.post('/authorize/get-token', { key: '12345678' })
		.expect(200, { token: "abc123" })
	.next()
	.undiscuss()
	.discuss('401 Unauthorized status when the requestors key is not found')
	.post('/authorize/get-token', { key: '-1' })
		.expect(401)
	.next()
	.undiscuss()
	.discuss('the register-key endpoint should respond with a 400 Bad Request')
	.discuss('status when insufficient information was provided to register the new key')
	.post('/authorize/register-key')
		.expect(400)
	.undiscuss().undiscuss()
	.export(module);