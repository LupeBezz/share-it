/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we import Vue and its functions (we won't touch that file)

import * as Vue from "./vue.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we initialise the Vue app

const app = Vue.createApp({
    data() {
        return { images: [] };
    },
    mounted() {
        fetch("/images")
            .then((result) => result.json())
            .then((imagesArray) => {
                this.images = imagesArray;
            });
    },
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we mount the Vue app

app.mount("main");
