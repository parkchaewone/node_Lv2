const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  //string= 문자타입  number=숫자
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
//module.exports로 뒷내용을 내보내준다
//post안에 위의  스키마를  적용
module.exports = mongoose.model("post", postsSchema);
