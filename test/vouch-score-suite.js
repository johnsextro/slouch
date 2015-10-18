var APIeasy = require('api-easy'),
     assert = require('assert');

var suite = APIeasy.describe('vouch-score');

suite.discuss('When using vouch-score')  
     .discuss('the get-score endpoint')
     .use('localhost', 3000)
     .setHeader('Content-Type', 'application/json')
     .get('/get-score/2/')
     .expect(200)
     .expect('should respond with a score equal to 20', function (err, res, body) {
           assert.isNotNull(body);
           assert.deepEqual(JSON.parse(body), {"score": 20});
      })
     .next()
     .discuss('the get-score endpoint should respond with a not found status when the id is not found')
     .get('/get-score/-1/')
     .expect(400)
     .export(module);