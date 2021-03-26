const { json } = require("express");
const express = require("express");
const app = express();
const s3 = require("./s3.js");
const { s3Url } = require("./s3urlconfig.json");

const {
    getImages,
    addImage,
    getSingleImage,
    addComment,
    getComments,
} = require("./db.js");

//middleware
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);
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

app.get("/singleimage/:id", (req, res) => {
    console.log("req.params", req.params);
    console.log("req.params.id", req.params.id);
    let id = req.params.id;
    console.log("selectedImages has been hit");
    getSingleImage(id).then((data) => {
        // console.log("successful singleImages data query: ", data);
        res.json(data.rows);
    });
});
app.get("/comment/:imageID", (req, res) => {
    console.log("I am in the get comments");
    let id = req.params.imageID;
    console.log("id get function", id);
    getComments(id)
        .then((data) => {
            console.log("rows at getComment", data.rows);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error", err);
        });
});
// app.get("/comment/:imageID", (req, res) => {
//     console.log("req.params", req.params);
//     let id = req.params.imageID;
//     console.log("id in the comment function", id);
//     getComment(id)
//         .then((data) => {
//             console.log("after get ID");
//             console.log("data.rows", data.rows);
//             res.json(data.rows);
//         })
//         .catch((err) => {
//             console.log("error", err);
//         });
// });

app.post("/comment/:imageId", (req, res) => {
    console.log("req.params", req.params);
    console.log(req);
    console.log("comment req.body", req.body);
    let comment = req.body.comment;
    let username = req.body.username;
    let imageID = req.body.imageID;
    addComment(username, comment, imageID).then((data) => {
        console.log(data);
        console.log("After insert");
        res.json(data.rows);
    });
});

app.listen(8080, () => console.log("Server listening"));
