require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('get /todos', async() => {

      const expectation = [];

      const data = await fakeRequest(app)
        .get('/api/task')
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('post /todo', async() => {

      const expectation = [ 
        {
          id: expect.any(Number),
          description: 'test post route',
          status: false,
          owner_id: expect.any(Number)
        }];

      const data = await fakeRequest(app)
        .post('/api/task')
        .send({
          description: 'test post route',
          status: false,
        })
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('put /todo', async() => {

      const expectation = [ 
        {
          id: expect.any(Number),
          description: 'test post route',
          status: true,
          owner_id: expect.any(Number)
        }];

      const data = await fakeRequest(app)
        .put('/api/task/4')
        .send({
          status: true,
        })
        .expect('Content-Type', /json/)
        .set('Authorization', token)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
