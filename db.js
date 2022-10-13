/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - database info

let dbUrl;

if (process.env.NODE_ENV === "production") {
    dbUrl = process.env.DATABASE_URL;
} else {
    const {
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME,
    } = require("./secrets.json");
    dbUrl = `postgres:${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - middleware

// to handle the database
const spicedPg = require("spiced-pg");
const db = spicedPg(dbUrl);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - database functions

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET IMAGES

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 3`);
};

module.exports.getMoreImages = (id) => {
    return db.query(
        `SELECT *, (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestIdOnTable" FROM images WHERE id < $1 ORDER BY id DESC LIMIT 6`,
        [id]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INSERT IMAGE

module.exports.insertImage = (title, description, username, url) => {
    return db.query(
        `INSERT INTO images(title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, description, username, url]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET IMAGE INFO

module.exports.getImagesInfo = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - INSERT COMMENTS

module.exports.insertComment = (id, comment, username) => {
    return db.query(
        `INSERT INTO comments(image_id, comment, username) VALUES ($1, $2, $3) RETURNING *`,
        [id, comment, username]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET COMMENTS

module.exports.getComments = (id) => {
    return db.query(
        `SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC`,
        [id]
    );
};
