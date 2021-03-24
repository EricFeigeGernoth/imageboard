const { json } = require("express");
const express = require("express");
const app = express();

const { getImages } = require("./db.js");

//middleware
app.use(express.static("./public"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

// be mindful that images that are over 2mb will not be uploaded! so if you try to upload an
// image and it doesn't work - it might be the image is too big :)
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("Working");
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    if (req.file) {
        // this runs if everything worked!
        res.json({
            success: true,
        });
    } else {
        // this runs if something goes wrong along the way :(
        res.json({
            success: false,
        });
    }
});

app.get("/images", (req, res) => {
    console.log("images has been hit");
    getImages().then((data) => {
        console.log("successful data query: ", data);
        res.json(data.rows);
    });
});

app.get("/cities", (req, res) => {
    console.log("/cities has been hit");
});

app.listen(8080, () => console.log("Server listening"));
