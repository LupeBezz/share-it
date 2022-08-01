/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - favourites component

const favouritesComponent = {
    data() {
        return { favourites: [] };
    },

    props: ["id"],

    mounted() {},

    methods: {
        addFavourite(e) {
            fetch(`/image/${this.id}`)
                .then((result) => result.json())
                .then((imageInfoDB) => {
                    console.log("imageInfoDB[0]: ", imageInfoDB[0]);
                    //this.favourites.unshift(imageInfoDB[0]);
                    //console.log("this.favourites: ", this.favourites);
                    this.$emit("favourite", imageInfoDB[0]);
                });
            e.target.style.color = "red";
        },
    },

    template: `<div id="favourite" @click="addFavourite">♥</div>`,
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we export the component

export default favouritesComponent;
