var APIeasy = require('api-easy'),
     assert = require('assert');

var suite = APIeasy.describe('authorize');

suite.discuss('When using the vouch-score')
	 .discuss('authorize endpoint')
	    .use('localhost', 3000)
	    .setHeader('Content-Type', 'application/json')

	    .post('/authorize/get-token', { key: '12345678' })
	    	.expect(200, { token: "abc123" })
	    .export(module);