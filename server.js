/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - create server (express)

const express = require("express");
const app = express();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - middleware

// to work with file and directory paths
const path = require("path");

// to parse the request bodies in forms and make the info available as req.body
app.use(express.urlencoded({ extended: false }));

// (aws) to upload files to aws
const s3 = require("./s3");

// to store files in the local server
const uploader = require("./middleware").uploader;

// to unpack JSON in the request body
app.use(express.json());

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - require our database

const db = require("./db");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve public folder and uploads

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - routes

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET LAST IMAGES FROM DB

app.get("/images.json", (req, res) => {
    db.getImages()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getImages", err);
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET MORE IMAGES FROM DB

app.get("/more-images/:id", (req, res) => {
    db.getMoreImages(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getMoreImages after db query: ", err);
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET IMAGE INFO FROM DB

app.get("/image/:id", (req, res) => {
    db.getImagesInfo(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getImagesInfo", err);
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - UPLOAD IMAGE

app.post(
    "/upload.json",
    uploader.single("uploadPicture"),
    s3.upload,
    (req, res) => {
        let fullUrl =
            "https://s3.amazonaws.com/spicedling/" + req.file.filename;

        db.insertImage(
            req.body.uploadTitle,
            req.body.uploadDescription,
            req.body.uploadUsername,
            fullUrl
        )
            .then((results) => {
                res.json(results.rows);
            })
            .catch((err) => {
                console.log("error in insertImage", err);
            });
    }
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET COMMENTS FROM DB

app.get("/comments/:id", (req, res) => {
    db.getComments(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getComments", err);
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - UPLOAD COMMENT

app.post("/upload/comment", (req, res) => {
    db.insertComment(req.body.id, req.body.comment, req.body.username)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in insertComment", err);
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SERVE HTML (always in the end!)

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - listen to the server

const PORT = 8080 || process.env.PORT;
app.listen(PORT, () => console.log(`I'm listening on ${PORT}`));
