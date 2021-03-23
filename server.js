const { json } = require("express");
const express = require("express");
const app = express();

const { getImages } = require("./db.js");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    console.log("images has been hit");
    getImages().then((data) => {
        console.log("successful data query: ", data);
        res.json(data);
    });
});

app.get("/cities", (req, res) => {
    console.log("/cities has been hit");
});

app.listen(8080, () => console.log("Server listening"));
