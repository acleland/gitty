const pool = require('../utils/pool');

module.exports = class Post {
  id;
  post;
  author_id;
  constructor(row) {
    this.id = row.id;
    this.post = row.post;
    this.author_id = row.author_id;
  }

  static async getAll() {
    const { rows } = await pool.query(`
    SELECT * FROM gitty_posts`);
    return rows.map((row) => new Post(row));
  }
};
