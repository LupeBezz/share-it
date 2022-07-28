/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general stuff

const path = require("path");
const express = require("express");
const app = express();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - require other files

const db = require("./db");
const s3 = require("./s3");
const uploader = require("./middleware").uploader;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve public / uploads folder

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

//express.json parses bodies that are in JSON format
app.use(express.json());

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - requests

// - - - - - - - - - - - - - - - - - - - - - - - - - - get images from database

app.get("/images.json", (req, res) => {
    db.getImages()
        .then((results) => {
            //console.log("results.rows: ", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getImages", err);
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - get image info from database

app.get("/image/:id", (req, res) => {
    console.log("hitting /image/:id route");
    console.log("req.params: ", req.params);

    db.getImagesInfo(req.params.id)
        .then((results) => {
            console.log("results.rows: ", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getImagesInfo", err);
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - post images

app.post(
    "/upload.json",
    uploader.single("uploadPicture"),
    s3.upload,
    (req, res) => {
        //console.log("inside post -upload.json");
        //console.log("req.body inside post-upload: ", req.body);
        //console.log("req.file inside post-upload:", req.file);

        let fullUrl =
            "https://s3.amazonaws.com/spicedling/" + req.file.filename;

        db.insertImage(
            req.body.uploadTitle,
            req.body.uploadDescription,
            req.body.uploadUsername,
            fullUrl
        )
            .then((results) => {
                console.log("insertImage worked!");
                console.log("results:", results);
                res.json(results.rows);
            })
            .catch((err) => {
                console.log("error in insertImage", err);
            });
    }
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get * basic html - always at the end!!!

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - listen to the server

const PORT = 8080 || process.env.PORT;
app.listen(PORT, () => console.log(`I'm listening on ${PORT}`));
