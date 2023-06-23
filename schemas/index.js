const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/project")
    // .connect(mongodb:127.0.0.1:27017")
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결에러", err);
});

module.exports = connect;
