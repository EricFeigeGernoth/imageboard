(function () {
    new Vue({
        el: "#main",
        data: {
            name: "Eric",
            images: [],
            // this is the perfect location for us to ask if there are any images to retrieve any images from our database
            mounted: function () {
                console.log("my vue instance has mounted");
                var self = this;
                axios
                    .get("/images")
                    .then(function (response) {
                        console.log("resp from /images: ", resp);
                        self.images = resp.data;
                    })
                    .catch("err: ", err);
            },

            methods: {
                myFunction: function (arg) {
                    console.log(
                        "myFn is running & the argument passed to it is: ",
                        arg
                    );
                },
            },
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
