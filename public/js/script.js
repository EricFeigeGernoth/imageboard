(function () {
    Vue.component("my-component", {
        template: "#template",
        props: ["id"],
        data: function () {
            return {
                title: this.title,
                description: this.description,
                url: this.url,
                username: this.username,
            };
        },
        mounted: function (id) {
            console.log("id", this.id);

            axios
                .get("/singleimage/" + this.id)
                .then(function (resp) {
                    console.log("resp from /greatImages: ", resp);
                    this.title = resp.data[0].title;
                    this.description = resp.data[0].description;
                    this.url = resp.data[0].url;
                    this.username = resp.data[0].username;
                    // self.images = resp.data;
                    console.log(this.title);
                    console.log(this.description);
                })
                .catch((err) => console.log("err", err));
        },

        methods: {},
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
        },
    });
})();
