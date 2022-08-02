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
            favourites: [],
            message: "",
            loading: "",
            id: 0,
            lowestIdOnTable: "",
            button: 1,
            allpics: 1,
            allfavs: 0,
        };
    },
    components: { "modal-component": modalComponent },
    methods: {
        onFormSubmit(e) {
            //console.log("form trying to submit");
            this.message = "";

            //we want to prevent the automatic upload, because we want to check first whether there is file or not
            e.preventDefault();

            // check if there is a file or not - fileInput.files returns an array with (or without!) files
            const form = e.currentTarget;
            //console.log("form: ", form);

            const fileInput = form.querySelector("input[type=file]");
            //console.log("fileInput.files: ", fileInput.files);

            // check if the text input fields exceed the required length
            const titleInput = form.querySelector("input[name=uploadTitle]");
            //console.log("titleInput.value: ", titleInput.value);
            //console.log("titleInput.value.length: ", titleInput.value.length);
            const descriptionInput = form.querySelector(
                "input[name=uploadDescription]"
            );
            const usernameInput = form.querySelector(
                "input[name=uploadUsername]"
            );

            if (titleInput.value.length > 25) {
                this.message = "your title cannot be longer that 25 characters";
                return;
            }
            if (descriptionInput.value.length > 50) {
                this.message =
                    "your description cannot be longer that 50 characters";
                return;
            }
            if (usernameInput.value.length > 20) {
                this.message =
                    "your username cannot be longer that 20 characters";
                return;
            }

            //is the Array files empty? aka, is there an uploaded picture?

            if (fileInput.files.length < 1) {
                //alert("please upload a file");
                this.message = "please select a file!";
                return;
            }

            //is the file too big? (max 10MB = 10.000.000)

            if (fileInput.files[0].size > 2000000) {
                //alert("please upload a file");
                this.message = "your picture cannot be bigger than 2MB";
                return;
            } else {
                this.loading = "loading...";
            }

            //now that we know that everything is ok, we submit the form
            // this.message = "your file is being uploaded";

            const formData = new FormData(form);
            fetch("/upload.json", { method: "post", body: formData })
                .then((res) => res.json())

                .then((serverData) => {
                    //console.log("serverData[0]: ", serverData[0]);

                    //if there is an image, push it to the empty array
                    this.images.unshift(serverData[0]);
                    this.status = serverData.status;
                    this.message = "";
                    this.uploadTitle = "";
                    this.uploadDescription = "";
                    this.uploadUsername = "";
                    this.loading = "";
                })
                .catch((err) => {
                    this.status = err.status;
                    this.message = "There has been a problem, please try again";
                });
        },
        closeAppModal: function () {
            this.id = 0;
        },

        addFavourite: function (value) {
            console.log("favourite arrived to app from child :", value);
            this.favourites.unshift(value);
            console.log("fav array: ", this.favourites);
        },

        showFavourites: function () {
            if (this.allpics === 1 && this.allfavs === 0) {
                this.allpics = 0;
                this.allfavs = 1;
            } else {
                this.allpics = 1;
                this.allfavs = 0;
            }
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

                    // console.log("this.lowestIdOnTable: ", this.lowestIdOnTable);
                    // console.log(
                    //     "this.images[this.images.length - 1].id: ",
                    //     this.images[this.images.length - 1].id
                    // );
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
        let browserUrl = location.pathname;
        let filteredUrl = parseInt(browserUrl.substring("8")); //we cut "/images/" after the slash to get the current id
        if (filteredUrl != 0) {
            this.id = filteredUrl;
            //console.log("we have an id");
        }

        fetch("/images.json")
            .then((result) => result.json())
            .then((imagesArray) => {
                this.images = imagesArray;
                //console.log("location.pathname: ", location.pathname);
            });

        addEventListener("popstate", (e) => {
            let browserUrl = location.pathname;
            //console.log("browserUrl: ", browserUrl);
            let filteredUrl = parseInt(browserUrl.substring("8")); //we cut "/images/" after the slash to get the current id
            //console.log("parsed+filtered: ", filteredUrl);
            if (filteredUrl != 0) {
                this.id = filteredUrl;
                //console.log("we have an id");
            }
        });
    },
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we mount the Vue app

app.mount("body");
