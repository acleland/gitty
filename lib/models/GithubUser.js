const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
  }

  static async insert({ username, email }) {
    if (!username) throw new Error('Username is required');

    const { rows } = await pool.query(
      `
    INSERT INTO github_users (username, email) VALUES ($1, $2)
    RETURNING *
    `,
      [username, email]
    );

    return new GithubUser(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      'SELECT * FROM github_users WHERE username=$1',
      [username]
    );

    if (!rows[0]) return null;

    return new GithubUser(rows[0]);
  }

  toJSON() {
    return { ...this };
  }
};
