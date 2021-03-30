(function () {
    Vue.component("comment", {
        template: "#commentsection",
        props: ["imageID"],
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
                // created_at: "",
            };
        },
        mounted: function () {
            console.log("is this really the imageID", this.imageID);
            axios.get("/comment/" + this.imageID).then((resp) => {
                console.log("Get comment function worked yeah");
                console.log("resp mounted get comments", resp);
                console.log("resp dataaaaa mounted get comments", resp.data);
                for (var i = 0; i < resp.data.length; i++) {
                    console.log("data.length mounted", resp.data.length);
                    let time = resp.data[i].created_at.slice(0, 10);
                    resp.data[i].created_at = time;
                }
                console.log("resp.data mounted 701238470123074", resp.data);

                this.comments = resp.data;
            });
        },
        watch: {
            imageID: function (imageID) {
                this.imageID = imageID;
                console.log("this image ID in watch", this.imageID);
                axios
                    .get("/comment/" + this.imageID)
                    .then((resp) => {
                        for (var i = 0; i < resp.data.length; i++) {
                            console.log(
                                "data.length mounted",
                                resp.data.length
                            );
                            let time = resp.data[i].created_at.slice(0, 10);
                            resp.data[i].created_at = time;
                        }
                        this.comments = resp.data;
                    })
                    .catch((err) => {
                        console.log("err", err);
                        this.$emit("close");
                    });
            },
        },
        methods: {
            clickCommentBox: function (imageID) {
                return console.log("inside Clickbox", imageID);
            },
            submit: function (imageID) {
                // console.log(this);
                // console.log(this.comment);
                // console.log(this.username);

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
                        // console.log("11111resp from POST /comment: ", response);
                        // console.log("this", this);
                        // console.log(
                        //     "Line 70 response.data[0]",
                        //     response.data[0]
                        // );
                        this.username = response.data[0].username;
                        let username = this.username;
                        this.comment = response.data[0].comment;
                        let comment = this.comment;

                        let time = response.data[0].created_at.slice(0, 10);
                        response.data[0].created_at = time;
                        // console.log(
                        //     "response.data[0] after slice",
                        //     response.data[0]
                        // );
                        this.comments.unshift(response.data[0]);
                        // console.log("this.comments", this.comments);
                        // console.log("this.username", this.username);
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
                previousId: "",
                nextId: "",
                previous: true,
                next: true,
            };
        },
        mounted: function (id) {
            console.log("here this id", this.id);

            axios
                .get("/singleimage/" + this.id)
                .then((resp) => {
                    console.log("resp from /greatImages: ", resp);
                    this.title = resp.data[0].title;
                    this.description = resp.data[0].description;
                    this.url = resp.data[0].url;
                    this.username = resp.data[0].username;
                    this.singleID = resp.data[0].id;
                    // this.previousId = resp.data[0].previousId;
                    // this.nextId = resp.data[0].nextId;
                    if (resp.data[0].previousId == null) {
                        this.previous = false;
                    } else {
                        this.previous = true;
                        this.previousId = resp.data[0].previousId;
                    }
                    if (resp.data[0].nextId == null) {
                        this.next = false;
                    } else {
                        this.next = true;
                        this.nextId = resp.data[0].nextId;
                    }
                })
                .catch((err) => console.log("err", err));
        },
        watch: {
            id: function (id) {
                console.log(id);
                console.log("this beginning watch", this);
                this.id = id;
                console.log("this id in the watch modal", this.id);
                var self = this;
                axios
                    .get("/singleimage/" + this.id)
                    .then((resp) => {
                        console.log("resp from /greatImages watcher: ", resp);

                        this.title = resp.data[0].title;
                        this.description = resp.data[0].description;
                        this.url = resp.data[0].url;
                        this.username = resp.data[0].username;
                        this.singleID = resp.data[0].id;
                        // this.previousId = resp.data[0].previousId;
                        // this.nextId = resp.data[0].nextId;
                        if (resp.data[0].previousId == null) {
                            this.previous = false;
                        } else {
                            this.previous = true;
                            this.previousId = resp.data[0].previousId;
                        }
                        if (resp.data[0].nextId == null) {
                            this.next = false;
                        } else {
                            this.next = true;
                            this.nextId = resp.data[0].nextId;
                        }
                    })
                    .catch((err) => {
                        console.log("err", err);
                        this.$emit("close");
                    });
                // this will run whenever the id changes
                // so whenever the id in the url changes, this function runs
            },
        },

        methods: {
            closeModal: function () {
                console.log("closeModal is running!");
                // console.log("about to emit an event from the component!!");
                this.$emit("close");
            },
            previousPage: function (previousId) {
                axios
                    .get("/singleimage/" + this.previousId)
                    .then((resp) => {
                        console.log("resp from /greatImages watcher: ", resp);
                        // console.log("resp.data", resp.data[0]);
                        // console.log("self", self);
                        this.title = resp.data[0].title;
                        this.description = resp.data[0].description;
                        this.url = resp.data[0].url;
                        this.username = resp.data[0].username;
                        this.singleID = resp.data[0].id;

                        // this.nextId = resp.data[0].nextId;
                        console.log("current ID", resp.data[0].id);
                        console.log("location.hash", location.hash);
                        location.hash = `#+${resp.data[0].id}`;
                        console.log("location.hash", location.hash);
                        if (resp.data[0].previousId == null) {
                            this.previous = false;
                        } else {
                            this.previous = true;
                            this.previousId = resp.data[0].previousId;
                        }
                        if (resp.data[0].nextId == null) {
                            this.next = false;
                        } else {
                            this.next = true;
                            this.nextId = resp.data[0].nextId;
                        }
                    })
                    .catch((err) => {
                        console.log("err", err);
                        this.$emit("close");
                    });
            },
            nextPage: function (nextId) {
                axios
                    .get("/singleimage/" + this.nextId)
                    .then((resp) => {
                        console.log("resp from /greatImages watcher: ", resp);

                        this.title = resp.data[0].title;
                        this.description = resp.data[0].description;
                        this.url = resp.data[0].url;
                        this.username = resp.data[0].username;
                        this.singleID = resp.data[0].id;
                        // this.previousId = resp.data[0].previousId;

                        console.log("current ID", resp.data[0].id);
                        console.log("next ID", resp.data[0].nextId);
                        // console.log("location.hash", location.hash);
                        location.hash = `#+${resp.data[0].id}`;
                        console.log("location.hash", location.hash);
                        if (resp.data[0].nextId == null) {
                            console.log("I am in the if clause hahah");
                            this.next = false;
                        } else {
                            this.next = true;
                            this.nextId = resp.data[0].nextId;
                        }
                        if (resp.data[0].previousId == null) {
                            this.previous = false;
                        } else {
                            this.previous = true;
                            this.previousId = resp.data[0].previousId;
                        }
                    })
                    .catch((err) => {
                        console.log("err", err);
                        this.$emit("close");
                    });
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
            selectedImage: location.hash.slice(1),
            more: true,
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

            addEventListener("hashchange", () => {
                console.log("This is the HASH CLIQUE");
                this.selectedImage = location.hash.slice(1);
            });
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
                location.hash = "";
                // this is where you want to update data to close the modal by setting id to null
            },
            moreImages: function () {
                // console.log("I am in the moreImages function");
                // console.log("images array", this.images);
                let visibleImages = this.images;
                console.log(
                    "visible Images",
                    visibleImages[visibleImages.length - 1]
                );
                let visibleID = visibleImages[visibleImages.length - 1].id;
                console.log(visibleID);
                axios
                    .get("/images/" + visibleID)
                    .then((resp) => {
                        console.log("resp from /images: ", resp.data);
                        console.log("this", this);
                        let newImages = resp.data;
                        console.log("newImages", newImages);
                        // this.images.push(resp.data);
                        for (var i = 0; i < newImages.length; i++) {
                            if (newImages[i].lowestId >= newImages[i].id) {
                                this.more = false;
                            } else {
                                this.more = true;
                            }
                            this.images.push(newImages[i]);
                        }
                        // self.images = resp.data;
                    })
                    .catch((err) => console.log("err", err));
            },
        },
    });
})();
