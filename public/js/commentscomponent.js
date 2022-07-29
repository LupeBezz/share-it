/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - comments component

const commentsComponent = {
    data() {
        return {
            allcomments: [],
            data: [],
            comment: "",
            username: "",
            error: "",
        };
    },

    props: ["id"],

    mounted() {
        console.log("the commentsComponent is connected");
        //console.log("this.id: ", this.id);

        fetch(`/comments/${this.id}`)
            .then((result) => result.json())
            .then((commentsFromTable) => {
                console.log("commentsFromTable: ", commentsFromTable);
                this.allcomments = commentsFromTable;
                console.log("this.allcomments: ", this.allcomments);
                let unparsedData = commentsFromTable[0].created_at;
                let parsedData =
                    unparsedData.slice(8, 10) +
                    "/" +
                    unparsedData.slice(5, 7) +
                    "/" +
                    unparsedData.slice(0, 4);
                this.data = parsedData;
            });
    },

    methods: {
        postComment: function () {
            fetch("/upload/comment", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: this.id,
                    comment: this.comment,
                    username: this.username,
                }),
            })
                .then((res) => res.json())
                .then((response) => {
                    console.log("response[0]: ", response[0]);
                    this.allcomments.unshift(response[0]);
                })
                .catch((err) => {
                    this.status = err.status;
                });
            console.log("this.id: ", this.id);
        },
    },

    template: `
        <div id="comments-component">
            <div id="comments-input">
                <input type="text" id="comments-inputfield" name="comment" v-model="comment" placeholder="comment">
                <input type="text" id="comments-inputfield" name="username" v-model="username" placeholder="username">
                <input type="submit" value="upload" id="comments-submit" @click="postComment">
            </div>
            <div id="comments-display">
                <div v-for="comment in allcomments">
                <p id="comment-display">{{comment.comment}} - by {{comment.username}} on {{this.data}} </p>
                </div>
            </div>
        </div>`,
};

//@click or @submit??

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we export the component

export default commentsComponent;
