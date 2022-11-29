const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // used to avoid decpriciation warnings
    })
    .then(console.log("DB CONNECTED with a Success"))
    .catch((error) => {
      console.log("DB CONNECTION Failed");
      console.log(error);
      process.exit(1);
    });
};
