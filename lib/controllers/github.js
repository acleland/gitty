const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const authenticate = require('../middleware/authenticate');
const {
  exchangeCodeForToken,
  getGithubProfile,
} = require('../services/github');
const jwt = require('jsonwebtoken');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`
    );
  })
  .get('/callback', async (req, res) => {
    // Get code from github
    const { code } = req.query;

    // Exchange code for token
    const githubToken = await exchangeCodeForToken(code);
    console.log('githubToken', githubToken);

    // Get info from github about the user with the token
    const githubProfile = await getGithubProfile(githubToken);
    console.log('githubProfile', githubProfile);

    // Get existing user if there is one
    let user = await GithubUser.findByUsername(githubProfile.login);

    if (!user) {
      user = await GithubUser.insert({
        username: githubProfile.login,
        email: githubProfile.email,
      });
    }

    // Create jwt
    const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    // Set cookie and redirect
    res
      .cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .redirect('/api/v1/posts');
  })
  .get('/user', authenticate, async (req, res) => {
    res.json(req.user);
  });
