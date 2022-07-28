/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we import Vue and its functions (we won't touch that file)

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
                let parsedData = unparsedData.slice(0, 10);
                this.imageData = parsedData;
            });
    },
    methods: {
        // selectImageId: function () {},
        closeModal: function () {
            console.log("closing modal");
            this.$emit("close");
        },
    },
    template: `
        <div id='test'>
            <p id="modal-x" @click="closeModal"> X </p>
            <img v-bind:src="imageInfo.url" width="50">
            <p id="modal-title">{{imageInfo.title}}</p>
            <p id="modal-description">{{imageInfo.description}}</p>
            <p id="modal-username">Uploaded by {{imageInfo.username}} on {{imageData}} </p>
        </div>`,
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we export the component

export default modalComponent;
