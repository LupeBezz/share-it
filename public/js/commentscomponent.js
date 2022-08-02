/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - comments component

const commentsComponent = {
    data() {
        return {
            allcomments: [],
            data: [],
            comment: "",
            username: "",
            commentdata: "",
            error: "",
            message: "",
        };
    },

    props: ["id"],

    mounted() {
        //console.log("the commentsComponent is connected");
        //console.log("this.id: ", this.id);
        let unparsedData;
        fetch(`/comments/${this.id}`)
            .then((result) => result.json())
            .then((commentsFromTable) => {
                //console.log("commentsFromTable: ", commentsFromTable);
                this.allcomments = commentsFromTable;
                //console.log("this.allcomments: ", this.allcomments);
                unparsedData = commentsFromTable[0]?.created_at;
                let parsedData =
                    unparsedData.slice(8, 10) +
                    "/" +
                    unparsedData.slice(5, 7) +
                    "/" +
                    unparsedData.slice(0, 4);
                this.data = parsedData;
                console.log("unparsedData: ", unparsedData);
                console.log("parsedData: ", parsedData);
            });
    },

    methods: {
        postComment: function (e) {
            //console.log("e", e.target);
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
                        console.log("response[0]: ", response[0]);

                        let unparsedData = response[0].created_at;
                        let parsedData =
                            unparsedData.slice(8, 10) +
                            "/" +
                            unparsedData.slice(5, 7) +
                            "/" +
                            unparsedData.slice(0, 4);
                        this.commentdata = parsedData;
                        this.allcomments.unshift(response[0]);
                        this.comment = "";
                        this.username = "";
                    })
                    .catch((err) => {
                        this.status = err.status;
                    });
            } else {
                this.message = "Please enter a comment";
            }
        },
    },

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
                <p id="comment-display" v-if="comment.username" >{{comment.comment}} - by {{comment.username}} on {{this.data}} </p>
                <p id="comment-display" v-else>{{comment.comment}} - posted anonimously on {{this.commentdata}} </p>
                </div>
            </div>
        </div>`,
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - we export the component

export default commentsComponent;
