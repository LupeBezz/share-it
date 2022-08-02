/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we import the components

import commentsComponent from "./commentscomponent.js";
import favouritesComponent from "./favouritescomponent.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - modal component

const modalComponent = {
    data() {
        return { imageInfo: [], imageData: [] };
    },
    props: ["id"],
    mounted() {
        history.pushState(null, null, `/images/${this.id}`);

        fetch(`/image/${this.id}`)
            .then((result) => result.json())
            .then((imageInfoDB) => {
                //console.log("imageInfoDB[0]: ", imageInfoDB[0]);
                this.imageInfo = imageInfoDB[0];
                let unparsedData = imageInfoDB[0].created_at;
                // let parsedData = unparsedData.slice(0, 10);
                let parsedData =
                    unparsedData.slice(8, 10) +
                    "/" +
                    unparsedData.slice(5, 7) +
                    "/" +
                    unparsedData.slice(0, 4);
                this.imageData = parsedData;

                // history.pushState(null, null, `/images/${this.id}`);
            });
    },
    components: {
        "comments-component": commentsComponent,
        "favourites-component": favouritesComponent,
    },
    methods: {
        closeModal: function () {
            this.$emit("close");
            history.pushState(null, null, "/");
        },
        sendFavourite: function (value) {
            console.log("favourite arrived to modal from child :", value);
            this.$emit("favourite", value);
        },
    },
    template: `
        <div id="modal">
            <div id='modal-window'>
                <div id="modal-left">
                    <img id="modal-image" v-bind:src="imageInfo.url"> 
                </div>
                <div id="modal-right">
                    <comments-component :id="id"></comments-component>
                    <div id="modal-text">
                    <favourites-component :id="id" @favourite="sendFavourite"></favourites-component>
                        <p id="modal-title" v-if="imageInfo.title">{{imageInfo.title}} - {{imageInfo.description}}  </p>
                        <p id="modal-title" v-else> Untitled </p>
                        <p id="modal-username" v-if="imageInfo.username">Uploaded by {{imageInfo.username}} on {{imageData}} </p>
                        <p id="modal-username" v-else>Uploaded anonimously on {{imageData}} </p>   
                    </div>  
                </div>   
            </div>
            <div id="overlay" @click="closeModal"></div>
        </div>`,
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we export the component

export default modalComponent;
