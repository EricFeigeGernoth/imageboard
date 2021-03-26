(function () {
    Vue.component("comment", {
        template: "#commentsection",
        props: ["imageID"],
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        mounted: function () {
            console.log("is this really the imageID", this.imageID);
            axios.get("/comment/" + this.imageID).then((resp) => {
                console.log("Get comment function worked yeah");
                console.log("resp", resp);
                console.log(resp.data);
                this.comments = resp.data;
            });
        },
        methods: {
            clickCommentBox: function (imageID) {
                return console.log("inside Clickbox", imageID);
            },
            submit: function (imageID) {
                console.log(this);
                console.log(this.comment);
                console.log(this.username);

                let comment = {
                    comment: this.comment,
                    username: this.username,
                    imageID: imageID,
                };
                console.log(comment);
                console.log("inside Clickbox", imageID);
                axios
                    .post("/comment/" + imageID, comment)
                    .then((response) => {
                        console.log("11111resp from POST /comment: ", response);
                        console.log("this", this);
                        console.log("response.data[0]", response.data[0]);
                        this.username = response.data[0].username;
                        this.comment = response.data[0].comment;
                        this.comments.unshift(response.data[0]);
                        console.log("this.comments", this.comments);
                        console.log("this.username", this.username);
                    })
                    .catch((err) => {
                        console.log("err in POST /comment: ", err);
                    });
            },
        },
    });

    Vue.component("modal", {
        template: "#template",
        props: ["id"],
        data: function () {
            return {
                title: this.title,
                description: this.description,
                url: this.url,
                username: this.username,
                singleID: this.singleID,
            };
        },
        mounted: function (id) {
            console.log("here this id", this.id);

            axios
                .get("/singleimage/" + this.id)
                .then((resp) => {
                    console.log("resp from /greatImages: ", resp);
                    console.log("resp.data", resp.data[0]);
                    this.title = resp.data[0].title;
                    this.description = resp.data[0].description;
                    this.url = resp.data[0].url;
                    this.username = resp.data[0].username;
                    this.singleID = resp.data[0].id;
                    // self.images = resp.data;
                    console.log("single id", this.singleID);
                    console.log(this.title);
                    console.log(this.description);
                    console.log(this);
                })
                .catch((err) => console.log("err", err));
        },

        methods: {
            closeModal: function () {
                console.log("closeModal is running!");
                // console.log("about to emit an event from the component!!");
                this.$emit("close");
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            name: "Eric",
            images: [],
            id: null,
            title: "",
            description: "",
            username: "",
            file: null,
            selectedImage: "",
            // this is the perfect location for us to ask if there are any images to retrieve any images from our database
        },
        mounted: function () {
            console.log("my vue instance has mounted");
            var self = this;
            axios
                .get("/images")
                .then(function (resp) {
                    console.log("resp from /images: ", resp);
                    self.images = resp.data;
                })
                .catch((err) => console.log("err", err));
        },

        methods: {
            handleClick: function (e) {
                // e.preventDefault();
                console.log("click on button");

                console.log(this.title);
                console.log(this.description);

                console.log(this.username);
                console.log(this.file);
                // we use FormData to send files over to the server!
                var formData = new FormData();
                //the file MUST go in formData
                //but I'm putting them here for convenience
                // ie it's nice to put all of the data we're sending over to the server
                // in one place
                formData.append("file", this.file);
                formData.append("description", this.description);
                formData.append("title", this.title);
                formData.append("username", this.username);

                console.log("formData: ", formData);
                axios
                    .post("/upload", formData)
                    .then((response) => {
                        console.log("11111resp from POST /upload: ", response);
                        console.log("this: ", this.images);
                        console.log("data", response.data);
                        this.images.unshift(response.data);
                        console.log("I am again in script.js");
                        console.log("this: ", this.images);
                    })
                    .catch((err) => {
                        console.log("err in POST /upload: ", err);
                    });
            },

            handleChange: function (e) {
                console.log("handleChange is running");
                console.log("e.target: ", e.target.files);
                this.file = e.target.files[0];
            },
            getId: function (imageID) {
                console.log("I clicked somehwere");
                console.log("e.target: ", imageID);
                this.selectedImage = imageID;
                // axios
                //     .get("/selectedImage")
                //     .then(function (resp) {
                //         console.log("resp from /images: ", resp);
                //         self.images = resp.data;
                //     })
                //     .catch((err) => console.log("err", err));
            },
            closeMePlease: function () {
                console.log(
                    "closeMePlease in the parent is running! The child caused this to happen!!!"
                );

                console.log(this);
                this.selectedImage = null;
                // this is where you want to update data to close the modal by setting id to null
            },
        },
    });
})();
