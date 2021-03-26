const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:ericfeigegernoth:bourne3@localhost:5432/imageboard"
);

// db.query("SELECT * FROM images")
//     .then(function (result) {
//         console.log(result.rows);
//     })
//     .catch(function (err) {
//         console.log(err);
//     });

module.exports.getImages = function () {
    return db.query(
        `SELECT id, url, title, description FROM images ORDER BY id DESC LIMIT 10;`
    );
};

module.exports.addImage = function (title, description, username, url) {
    return db.query(
        `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING title, description, username, url`,
        [title, description, username, url]
    );
};

module.exports.getSingleImage = function (imageID) {
    return db.query(
        `SELECT url, title, description, username, id FROM images WHERE id=$1 ;`,
        [imageID]
    );
};

module.exports.addComment = function (comment, username, id) {
    return db.query(
        `INSERT INTO comment (username, comment, images_id) VALUES ($1, $2, $3) RETURNING comment , username, images_id, id`,
        [username, comment, id]
    );
};

module.exports.getComment = function (imageID) {
    return db.query(`SELECT * FROM comment WHERE images_id=$1 `), [imageID];
};
