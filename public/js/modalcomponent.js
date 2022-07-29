/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we import the components

import commentsComponent from "./commentscomponent.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - modal component

const modalComponent = {
    data() {
        return { imageInfo: [], imageData: [] };
    },
    props: ["id"],
    mounted() {
        console.log("the modalComponent is connected");
        console.log("this.id: ", this.id);
        fetch(`/image/${this.id}`)
            .then((result) => result.json())
            .then((imageInfoDB) => {
                console.log("imageInfoDB[0]: ", imageInfoDB[0]);
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
            });
    },
    components: { "comments-component": commentsComponent },
    methods: {
        // selectImageId: function () {},
        closeModal: function () {
            console.log("closing modal");
            this.$emit("close");
        },
    },
    template: `
        <div id="modal">
            <div id='modal-window'>
                <img id="modal-image" v-bind:src="imageInfo.url">
                <div id="modal-text">
                    <p id="modal-title">{{imageInfo.title}} - {{imageInfo.description}} </p>
                    <p id="modal-username">Uploaded by {{imageInfo.username}} on {{imageData}} </p>
                    <comments-component :id="id"></comments-component>
                </div>  
            </div>
            <div id="overlay" @click="closeModal"></div>
        </div>`,
};

//<p id="modal-x" @click="closeModal"> X </p>

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we export the component

export default modalComponent;
