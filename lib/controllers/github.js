const { Router } = require('express');
const {
  exchangeCodeForToken,
  getGithubProfile,
} = require('../services/github');
// const jwt = require('jsonwebtoken');

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

    // Get info from github about the user with the token
    const githubProfile = await getGithubProfile(githubToken);

    res.json(githubProfile);
  });
