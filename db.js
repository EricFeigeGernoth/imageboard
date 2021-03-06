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
        `SELECT id, url, title, description FROM images ORDER BY id DESC LIMIT 3;`
    );
};

module.exports.getMoreImages = function (visibleID) {
    return db.query(
        `SELECT url, title, description, id, (
  SELECT id FROM images
  ORDER BY id ASC
  LIMIT 1
) AS "lowestId" FROM images
WHERE id < $1
ORDER BY id DESC
LIMIT 3;`,
        [visibleID]
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
        `SELECT url, title, description, username, id, 
        (SELECT id FROM images 
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 1) AS "previousId",
        (SELECT id FROM images 
        WHERE id > $1
        ORDER BY id ASC
        LIMIT 1) AS "nextId"  
        FROM images WHERE id=$1 ;`,
        [imageID]
    );
};

module.exports.addComment = function (username, comment, id) {
    return db.query(
        `INSERT INTO comment (username, comment, images_id) VALUES ($1, $2, $3) RETURNING comment , username, created_at, images_id, id`,
        [username, comment, id]
    );
};

module.exports.getComments = function (imageID) {
    return db.query(`SELECT * FROM comment WHERE images_id=$1 `, [imageID]);
};
