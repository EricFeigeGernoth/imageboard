const { json } = require("express");
const express = require("express");
const app = express();
const s3 = require("./s3.js");
const { s3Url } = require("./s3urlconfig.json");

const { getImages, addImage, getSingleImage } = require("./db.js");

//middleware
app.use(express.static("./public"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { DataBrew } = require("aws-sdk");
const { title } = require("process");

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
//
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("Working");
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    if (req.file) {
        console.log("I am in the if statement");
        addImage(
            req.body.title,
            req.body.description,
            req.body.username,
            s3Url + req.file.filename
        )
            .then((data) => {
                console.log("I am in dataaaaaaaaaa");
                console.log(data);
                console.log("data.rows[0]    ", data.rows[0]);
                res.json(data.rows[0]);
            })
            .catch((err) => {
                console.log("error at catching filename: ", err);
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

app.get("/selectedImage/:id", (req, res) => {
    console.log(req.params.id);
    console.log("selectedImages has been hit");
    getSingleImage().then((data) => {
        // console.log("successful singleImages data query: ", data);
        res.json(data.rows);
    });
});

app.get("/cities", (req, res) => {
    console.log("/cities has been hit");
});

app.listen(8080, () => console.log("Server listening"));
