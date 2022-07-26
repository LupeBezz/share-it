/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general stuff

const path = require("path");
const express = require("express");
const app = express();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - require database

const db = require("./db");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve public folder

app.use(express.static(path.join(__dirname, "public")));

//express.json parses bodies that are in JSON format
app.use(express.json());

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - requests

app.get("/images", (req, res) => {
    db.getImages()
        .then((results) => {
            res.json(results.rows);
            console.log(results.rows);
        })
        .catch((err) => {
            console.log("error in getImages", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - listen to the server

const PORT = 8080;
app.listen(PORT, () => console.log(`I'm listening on ${PORT}`));
