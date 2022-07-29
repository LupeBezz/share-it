/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we import Vue and its functions (we won't touch that file)

import * as Vue from "./vue.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we import the components

import modalComponent from "./modalcomponent.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we initialise the Vue app

const app = Vue.createApp({
    data() {
        return {
            uploadTitle: "",
            uploadDescription: "",
            uploadUsername: "",
            images: [],
            message: [],
            id: 0,
            lowestIdOnTable: "",
            button: 1,
        };
    },
    components: { "modal-component": modalComponent },
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
        closeAppModal: function () {
            this.id = 0;
        },
        getMoreImages() {
            let imageIdArray = [];
            this.images.forEach((image) => imageIdArray.push(image.id));
            // console.log("imageIds: ", imageIdArray);
            // console.log("smallest-imageIds: ", Math.min(...imageIdArray));

            let lowestIdOnScreen = Math.min(...imageIdArray);
            // console.log("lowestIdOnScreen:", lowestIdOnScreen);

            fetch(`/more-images/${lowestIdOnScreen}`)
                .then((res) => res.json())

                .then((moreImages) => {
                    moreImages.forEach((image) => this.images.push(image));
                    this.lowestIdOnTable = moreImages[0].lowestIdOnTable;

                    // console.log("moreImages: ", moreImages);
                    // console.log(
                    //     "moreImages[0].lowestIdOnTable",
                    //     moreImages[0].lowestIdOnTable
                    // );
                    // console.log("updated array: ", this.images);

                    console.log("this.lowestIdOnTable: ", this.lowestIdOnTable);
                    console.log(
                        "this.images[this.images.length - 1].id: ",
                        this.images[this.images.length - 1].id
                    );
                    if (
                        this.images[this.images.length - 1].id ===
                        this.lowestIdOnTable
                    ) {
                        this.button = 0;
                    }
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

        // if (this.images.length >= 3) {
        //     this.button = 1;
        // }
    },
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we mount the Vue app

app.mount("body");
