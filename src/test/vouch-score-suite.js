var APIeasy = require('api-easy'),
     assert = require('assert')
    , redis = require('redis')
    , client = redis.createClient();;

var suite = APIeasy.describe('vouch-score');
client.on("connect", function () {
    client.set('2', 20);
});

suite.discuss('When using vouch-score')  
     .discuss('the get-score endpoint')
     .use('localhost', 3000)
     .setHeader('Content-Type', 'application/json')
     .post('/get-score', { userId: '2' })
     .expect(200)
     .expect('should respond with a score equal to 20', function (err, res, body) {
         assert.isNotNull(body);
         assert.deepEqual(JSON.parse(body), {"score": 20});
    });

suite.undiscuss()
     .discuss('the get-score endpoint should respond with a 400 Bad Request status when the id is not found')
     .post('/get-score', { userId: '-1' })
     .expect(400);

suite.undiscuss()
     .discuss('the get-score endpoint should respond with a 400 Bad Request status when the id is not provided')
     .post('/get-score/')
     .expect(400);


suite.export(module);
client.del('2');