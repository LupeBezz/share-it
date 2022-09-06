/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - comments component

const commentsComponent = {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - data

    data() {
        return {
            allcomments: [],
            comment: "",
            username: "",
            commentdata: "",
            error: "",
            message: "",
        };
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - props: passed parent > child

    props: ["id"],

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - when mounted...

    mounted() {
        fetch(`/comments/${this.id}`)
            .then((result) => result.json())
            .then((commentsFromTable) => {
                //console.log("commentsFromTable: ", commentsFromTable);
                this.allcomments = commentsFromTable;
                //console.log("this.allcomments: ", this.allcomments);
            });
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - methods

    methods: {
        postComment: function (e) {
            if (this.comment.length >= 1) {
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
                        //console.log("response[0]: ", response[0]);
                        this.allcomments.unshift(response[0]);

                        //clean input field again
                        this.comment = "";
                        this.username = "";
                        this.message = "";
                    })
                    .catch((err) => {
                        this.status = err.status;
                    });
            } else {
                this.message = "Please enter a comment";
            }
        },
        parseDate: function (date) {
            let parsedDate =
                date.slice(8, 10) +
                "/" +
                date.slice(5, 7) +
                "/" +
                date.slice(0, 4);
            return parsedDate;
        },
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - template

    template: `
        <div id="comments-component">
            <div id="comments-input">
                <input type="text" id="comments-inputfield" name="comment" minlength="1" required v-model="comment" placeholder="comment" autocomplete="off">
                <input type="text" id="comments-inputfield" name="username" v-model="username" placeholder="username" autocomplete="off">
                <input type="submit" value="post" id="comments-submit" @click="postComment">
            </div>
            <p id="comments-message">{{this.message}}</p>
            <div id="comments-display">
                <div v-for="comment in allcomments">
                <p id="comment-display" v-if="comment.username" >{{comment.comment}} - by {{comment.username}} on {{parseDate(comment.created_at)}} </p>
                <p id="comment-display" v-else>{{comment.comment}} - posted anonimously on {{parseDate(comment.created_at)}} </p>
                </div>
            </div>
        </div>`,
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we export the component

export default commentsComponent;
