const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github');

describe('Gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });

  it('should login and redirect users to /api/v1/github/user which displays the logged in user info', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('GET /posts should return 401 if not logged in', async () => {
    const agent = request.agent(app);
    const res = await agent.get('/api/v1/posts');
    expect(res.status).toBe(401);
  });

  afterAll(() => {
    pool.end();
  });
});
