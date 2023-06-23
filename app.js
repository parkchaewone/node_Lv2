const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const port = 4001;
const commentsRouter = require("./routes/comment");
const postsRouter = require("./routes/post");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const connect = require("./schemas");

connect();

app.use(express.json());
app.use(cookieParser());

app.use("/api", [commentsRouter, postsRouter, usersRouter, authRouter]);

app.listen(port, () => {
  console.log(`${port}포트가 열였어요.`);
});
