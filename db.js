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
    return db.query(`SELECT url, title, description FROM users ;`);
};
