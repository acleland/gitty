-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS github_users;
DROP TABLE IF EXISTS gitty_posts;

CREATE TABLE github_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR NOT NULL,
  email VARCHAR
);

CREATE TABLE gitty_posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post VARCHAR NOT NULL,
  author_id BIGINT,
  FOREIGN KEY (author_id) REFERENCES github_users(id)
);