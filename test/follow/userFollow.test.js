process.env.NODE_ENV = 'test';
process.env.JWT_SECRET="somesecret";
const { app } = require('../../app');
const { expect, assert } = require('chai');
const request = require('supertest');


describe('GET /account/followers', () => {
    let post;

    it('should return array of followers', async () => {
      const response = await request(app).get('/account/followers')
      .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
      .send();
      expect(response.body.followers).to.be.an("array");
    });
});


describe('GET /account/following', () => {
    let post;

    it('should return array of following', async () => {
      const response = await request(app).get('/account/following')
      .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
      .send();
      expect(response.body.following).to.be.an("array");
    });

});

describe('PUT /account/followers', () => {
    let newUser;
    before(async () => {
      
        let userRes = await request(app).put('/auth/signup').send({
          name: 'new',
          email: 'test2@gmail.com',
          password: '123456'
        });

        let user = await request(app).post('/auth/login').send({
            email: 'test2@gmail.com',
            password: '123456'
          });
        newUser=user.body.userId;  
    });

    it('should  return 201 for following other user', async () => {
      const response = await request(app).put('/account/followers')
      .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
      .send({
        "userId": newUser
        });
        expect(response.statusCode).to.equal(201);
    });

    it('should  return 400 for following other user again', async () => {
        const response = await request(app).put('/account/followers')
        .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
        .send({
          "userId": newUser
          });
        expect(response.statusCode).to.equal(400);
    });

    it('should  return 404 for following other invalid user', async () => {
        const response = await request(app).put('/account/followers')
        .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
        .send({
          "userId": "63076189ad6a4690e9826cbc"
          });
        expect(response.statusCode).to.equal(404);
    });


});


describe('DELETE /account/unfollow', () => {
    let newUser;
    before(async () => {

        let user = await request(app).post('/auth/login').send({
            email: 'test2@gmail.com',
            password: '123456'
          });
        newUser=user.body.userId;  
    });

    it('should  return 201 for unfollowing other user', async () => {
      const response = await request(app).delete('/account/unfollow')
      .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
      .send({
        "userId": newUser
        });
        expect(response.statusCode).to.equal(201);
    });

    it('should  return 400 for unfollowing other user again', async () => {
        const response = await request(app).delete('/account/unfollow')
        .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
        .send({
          "userId": newUser
          });
        expect(response.statusCode).to.equal(400);
    });
    it('should  return 400 for unfollowing other user with samne id', async () => {
        const response = await request(app).delete('/account/unfollow')
        .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
        .send({
          "userId": process.env.USERID
          });
        expect(response.statusCode).to.equal(400);
    });

});


describe('DELETE /account/followers', () => {
    let newUser;
    let newUserToken;
    before(async () => {
        
        let user = await request(app).post('/auth/login').send({
            email: 'test2@gmail.com',
            password: '123456'
          });
        newUser=user.body.userId;  
        newUserToken=user.body.token;
        const response = await request(app).put('/account/followers')
        .set({ "Authorization": `Bearer ${newUserToken}` })
        .send({
          "userId": process.env.USERID
          });
    });

    it('should  return 201 for unfollowing other user', async () => {
      const response = await request(app).delete('/account/followers')
      .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
      .send({
        "userId": newUser
        });
        expect(response.statusCode).to.equal(201);
    });
    it('should  return 400 for unfollowing other user again', async () => {
        const response = await request(app).delete('/account/followers')
        .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
        .send({
          "userId": newUser
          });
          expect(response.statusCode).to.equal(400);
      });
  
    it('should  return 400 for unfollowing other user again', async () => {
        const response = await request(app).delete('/account/followers')
        .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
        .send({
          "userId": newUser
          });
        expect(response.statusCode).to.equal(400);
    });

    it('should  return 400 for unfollowing other user again', async () => {
        const response = await request(app).delete('/account/followers')
        .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
        .send({
          "userId": process.env.USERID
          });
        expect(response.statusCode).to.equal(400);
    });


});