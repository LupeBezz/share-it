/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we import Vue and its functions (we won't touch that file)

import * as Vue from "./vue.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we initialise the Vue app

const app = Vue.createApp({
    data() {
        return { images: [], message: [] };
    },
    methods: {
        onFormSubmit(e) {
            console.log("form trying to submit");

            //we want to prevent the automatic upload, because we want to check first whether there is file or not
            e.preventDefault();

            // check if there is a file or not - fileInput.files returns an array with (or without!) files
            const form = e.currentTarget;
            const fileInput = form.querySelector("input[type=file]");
            console.log(fileInput.files);

            //is the Array empty? aka, is there an uploaded picture?
            if (fileInput.files.length < 1) {
                alert("please upload a file");
                return;
            }

            //now that we know there is a file, we submit the form
            const formData = new FormData(form);
            fetch("/upload.json", { method: "post", body: formData })
                .then((res) => res.json())

                .then((serverData) => {
                    console.log("serverData[0]: ", serverData[0]);

                    //if there is an image, push it to the empty array
                    this.images.unshift(serverData[0]);
                    this.status = serverData.status;
                })
                .catch((err) => {
                    this.status = err.status;
                });
        },
    },
    mounted() {
        fetch("/images.json")
            .then((result) => result.json())
            .then((imagesArray) => {
                this.images = imagesArray;
            });
    },
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we mount the Vue app

app.mount("main");
