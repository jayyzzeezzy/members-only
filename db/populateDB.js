#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");
const { argv } = require("node:process");


let connectionString = '';
// read possible entry from users
switch (argv[2]) {
    case "LOCAL":
        connectionString = process.env.LOCAL_DB;
        break;
    case "REMOTE":
        connectionString = process.env.REMOTE_DB;
        break;
    default:
        console.log(`Sorry, "${argv[2]}" is not a valid entry. This is case sensitive.`);
};

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR ( 255 ) NOT NULL,
  last_name VARCHAR ( 255 ) NOT NULL,
  username VARCHAR ( 255 ) UNIQUE NOT NULL,
  password VARCHAR ( 255 ) NOT NULL,
  membership BOOLEAN DEFAULT FALSE,
  isadmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  author VARCHAR ( 255 ) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users 
    FOREIGN KEY (author) 
    REFERENCES users(username) 
    ON DELETE CASCADE
);

INSERT INTO users (first_name, last_name, username, password, membership, isadmin)
VALUES
  ('Jackie', 'Chan', 'jackiechan', '12345', TRUE, FALSE),
  ('Post', 'Malone', 'postmalone', '12345', TRUE, FALSE),
  ('Kevin', 'Nguyen', 'kevinnguyen', '12345', FALSE, FALSE),
  ('Nhi', 'Tran', 'nhitran', '12345', FALSE, FALSE),
  ('Vivian', 'Pham', 'vivianpham', '12345', FALSE, FALSE);

INSERT INTO posts (author, title, message)
VALUES
  ('jackiechan', 'Movie Star', 'I played in Rush Hour.'),
  ('postmalone', 'Artist', 'White Iverson...'),
  ('kevinnguyen', 'ABB', 'Where is the ABG heaven?'),
  ('nhitran', 'Raves', 'EDC 2030!!'),
  ('vivianpham', 'Fave DJ', 'Slander or Dabin');
`;

async function main() {
    console.log("seeding...");
    const client = new Client({
      connectionString: connectionString,
    });
    try {
        await client.connect();
        await client.query(SQL);
        console.log("Success!");
    } catch (err) {
        console.log("Error:", err);
    } finally {
        await client.end();
    }
}

main();