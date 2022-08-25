process.env.Secret_Key="sk_test_51LVDYLDejRFEnYSVn05P41aYhjwCxBSwFkwIa3iy0R1Q7JI05LE58wzdvbRjsEXwwQwcoNG03xKk6fEUSJ9OjWsn00CFsIjCfW";
const { app } = require('../../app');
const { expect, assert } = require('chai');
const request = require('supertest');

describe('POST /payment', () => {
    let post;

    it('should return 200 for sucessfull payment', async () => {
      const response = await request(app).post('/payment')
      .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
      .send();
      expect(response.statusCode).to.equal(200);
    });
});

describe('GET /feed/posts', () => {
  let post;

  it('should return array of posts for user now after payment', async () => {
    const response = await request(app).get('/feed/posts')
    .set({ "Authorization": `Bearer ${process.env.TOKEN}` })
    .send();
    expect(response.body.posts).to.be.an("array");
  });
});
