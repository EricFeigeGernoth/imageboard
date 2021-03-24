(function () {
    new Vue({
        el: "#main",
        data: {
            name: "Eric",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
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
                    .then((resp) => {
                        console.log("resp from POST /upload: ", resp);
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

            // myFunction: function (arg) {
            //     console.log(
            //         "myFn is running & the argument passed to it is: ",
            //         arg
            //     );
            // },
        },
    });
})();

//     cities: [
//         {
//             id: 1,
//             name: "Berlin",
//             country: "DE",
//         },
//         {
//             id: 2,
//             name: "Madrid",
//             country: "Spain",
//         },
//         {
//             id: 3,
//             name: "Sendai",
//             country: "Japan",
//         },
//     ],
// },
