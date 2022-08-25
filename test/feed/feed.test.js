
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET="somesecret";
const { app } = require('../../app');
const { expect, assert } = require('chai');
const request = require('supertest');



describe('GET /feed/posts', () => {
    let post;

    it('should return UNAUTHARIZED as user is not paid', async () => {
      const response = await request(app).get('/feed/posts')
      .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
      .send();
      expect(response.statusCode).to.equal(401);
    });

});
  
describe('POST /post', () => {
  let post;

  it('should return 201 with post obj for post created', async () => {
    const response = await request(app).post('/feed/post')
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send(
      {
      "title": "post 2 of test2",
      "content": "Testing Post"
    });
    process.env.POSTID=response.body.post._id;
    expect(response.statusCode).to.equal(201);
  });

});

describe('POST /post', () => {
  let post;

  it('should return error with wrong data for post creation', async () => {
    const response = await request(app).post('/feed/post')
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send(
      {
      "content": "Testing Post"
    });
    expect(response.body).to.contain.property('error');
  });

});

describe('GET /post/:postid', () => {
  it('should return post with id', async () => {
    const response = await request(app).get('/feed/post/'+process.env.POSTID)
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send();
    expect(response.body).to.contain.property('post');
  });

});


describe('GET /post/:postid', () => {
  it('should return error with invalid object Id', async () => {
    const response = await request(app).get('/feed/post/xxx')
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send();
    expect(response.body).to.contain.property('error');
  });
});

describe('GET /post/:postid', () => {
  it('should return error with wrong object Id', async () => {
    const response = await request(app).get('/feed/post/63076189ad6a4690e9826cbc')
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send();
    expect(response.body).to.contain.property('error');
  });
});

describe('PUT /post/:postid', () => {
  it('should return 200 for updated post', async () => {
    const response = await request(app).put('/feed/post/'+process.env.POSTID)
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send(  {
      "title": "post 2 of test2",
      "content": "Testing Post"
    });
    expect(response.statusCode).to.equal(200);
  });
});

describe('PUT /post/:postid', () => {
  it('should return error for not valid post', async () => {
    const response = await request(app).put('/feed/post/63076189ad6a4690e9826cbc')
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send(  {
      "title": "post 2 of test2",
      "content": "Testing Post"
    });
    expect(response.statusCode).to.equal(404);
  });
});

describe('PUT /post/:postid', () => {
  it('should return error for updated post with wrong data', async () => {
    const response = await request(app).put('/feed/post/'+process.env.POSTID)
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send(  {
      
      "content": "Testing Post"
    });
    expect(response.body).to.contain.property('error');
  });
});


describe('DELETE /post/:postid', () => {
  it('should return error for not valid post', async () => {
    const response = await request(app).delete('/feed/post/63076189ad6a4690e9826cbc')
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send();
    expect(response.statusCode).to.equal(404);
  });
});

describe('PUT /post/:postid', () => {
  it('should return 200 for DELETE post', async () => {
    const response = await request(app).delete('/feed/post/'+process.env.POSTID)
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send();
    expect(response.statusCode).to.equal(200);
  });
});
