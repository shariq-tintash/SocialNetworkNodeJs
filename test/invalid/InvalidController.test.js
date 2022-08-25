
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET="somesecret";
const { app } = require('../../app');
const { expect, assert } = require('chai');
const request = require('supertest');

describe('GET /invalid', () => {
    let post;

    it('should return 404 for invalid path', async () => {
      const response = await request(app).get('/invalid')
      .send();
      expect(response.statusCode).to.equal(404);
    });

});

describe('POST /invalid', () => {
    let post;

    it('should return 404 for invalid path', async () => {
      const response = await request(app).post('/invalid')
      .send();
      expect(response.statusCode).to.equal(404);
    });

});