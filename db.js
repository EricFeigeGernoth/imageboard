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
    return db.query(`SELECT id, url, title, description FROM images ;`);
};

module.exports.addImage = function (title, description, username, url) {
    return db.query(
        `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING title, description, username, url`,
        [title, description, username, url]
    );
};
