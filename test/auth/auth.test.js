/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET="somesecret";
const { app } = require('../../app');
const { expect, assert } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


describe('PUT /auth/signup', () => {
    let userRes;
    before(async () => {
      
      userRes = await request(app).put('/auth/signup').send({
        name: 'new',
        email: 'test@gmail.com',
        password: '123456'
      });
    });
    it('should return user object on successful signup', async () => {
      const { body } = userRes;
      expect(body).to.contain.property('userId');
    });
    it('should return user already exists error', async () => {
      const userResSecond = await request(app).put('/auth/signup').send({
        name: 'new',
        email: 'test@gmail.com',
        password: '123456'
      });
      const { body } = userResSecond;
      expect(body).to.contain.property('error');
    });

    it('should return validation error', async () => {
        const userResSecond = await request(app).put('/auth/signup').send({
          email: 'test@gmail.com',
          password: '123456'
        });
        const { body } = userResSecond;
        expect(body).to.contain.property('error');
    });

});
  

describe('POST /auth/login', () => {
  let userRes;
  before(async () => {
    userRes = await request(app).post('/auth/login').send({
      email: 'test@gmail.com',
      password: '123456'
    });
  });
  it('should return token on successful login', async () => {
    const { body } = userRes;
    process.env.TOKEN=body.token;
    process.env.USERID=body.userId;
    expect(body).to.contain.property('token');
  });

  it('should return wrong password error', async () => {
    const userResSecond = await request(app).post('/auth/login').send({
      email: 'test@gmail.com',
      password: '1234'
    });
    const { body } = userResSecond;
    expect(body).to.contain.property('error');
  });

  it('should return user not found', async () => {
    const userResSecond = await request(app).post('/auth/login').send({
      email: 'random@gmail.com',
      password: '123456'
    });
    const { body } = userResSecond;
    expect(body).to.contain.property('error');
  });
});