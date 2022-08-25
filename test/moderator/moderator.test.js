const { app } = require('../../app');
const { expect, assert } = require('chai');
const request = require('supertest');

describe('PUT /moderator/auth/signup', () => {
    let post;
    before(async () => {
      
        userRes = await request(app).put('/moderator/auth/signup').send({
          name: 'new',
          email: 'test@gmail.com',
          password: '123456'
        });
      });
      it('should return moderator object on successful signup', async () => {
        const { body } = userRes;
        expect(body).to.contain.property('userId');
      });
});

describe('POST /moderator/auth/login', () => {
    let post;
    before(async () => {
      
        userRes = await request(app).post('/moderator/auth/login').send({
          email: 'test@gmail.com',
          password: '123456'
        });
      });
      it('should return moderator object and token on successful login', async () => {
        const { body } = userRes;
        process.env.MOD_TOKEN=body.token;
        expect(body).to.contain.property('token');
      });
});

describe('GET /moderator/feed/posts', () => {

    it('should return possts array ', async () => {
      const response = await request(app).get('/moderator/feed/posts')
      .set({ "Authorization": `Bearer ${process.env.MOD_TOKEN}` })
      .send();
      expect(response.body.posts).to.be.an("array");
    });

});

describe('GET /moderator/feed/post/:postid', () => {
    before(async () => {
        const response = await request(app).post('/feed/post')
        .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
        .send(
          {
          "title": "post 2 of test2",
          "content": "Testing Post"
        });
        process.env.POSTID=response.body.post._id;
    });

    it('should return post with lenght 1 ', async () => {
      const response = await request(app).get('/moderator/feed/post/'+process.env.POSTID)
      .set({ "Authorization": `Bearer ${process.env.MOD_TOKEN}` })
      .send();
      expect(response.body).to.contain.property('post');
    });

});

describe('PUT /moderator/feed/post/:postid', () => {

    it('should uodate post', async () => {
      const response = await request(app).put('/moderator/feed/post/'+process.env.POSTID)
      .set({ "Authorization": `Bearer ${process.env.MOD_TOKEN}` })
      .send( {
        "title": "post 2 of test2",
        "content": "Testing Post"
      });
      expect(response.statusCode).to.equal(200);
    });

    it('should not update post', async () => {
        const response = await request(app).put('/moderator/feed/post/63076189ad6a4690e9826cbc')
        .set({ "Authorization": `Bearer ${process.env.MOD_TOKEN}` })
        .send( {
          "title": "post 2 of test2",
          "content": "Testing Post"
        });
        expect(response.statusCode).to.equal(404);
      });
});

describe('DELETE /moderator/feed/post/:postid', () => {

    it('should delete post', async () => {
      const response = await request(app).delete('/moderator/feed/post/'+process.env.POSTID)
      .set({ "Authorization": `Bearer ${process.env.MOD_TOKEN}` })
      .send();
      expect(response.statusCode).to.equal(500);
    });

});