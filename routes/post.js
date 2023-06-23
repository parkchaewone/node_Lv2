//express는  node에 가장 인기있느 웹 프레임워크
//프레임워크  (특정 프로그램 개발을위해 규칙을 제공하는 프로그램)
const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment");
//포스트를 스키마 post.js에 연결
const Posts = require("../schemas/post.js");

//게시글생성
router.post("/", async (req, res) => {
  //try안에서 에러가 발생될경우 catch로 넘어가서 해결
  try {
    //프론트엔드에서 받아온것을 정의(이름을지어줌)
    const { user, password, title, content } = req.body;
    //POST라는 게시글을작성
    await Posts.create({ user, password, title, content });
    return res.status(200).json({ message: "게시글을 생성하였습니다." });
    //문제가 생겼을떄 돌려  보낸다
  } catch {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//게시글 조회
router.get("/", async (req, res) => {
  const { category } = req.query;

  const post = await Posts.find(category ? { category } : {})
    .sort("-date")
    .exec();
  const postPrint = post.map((value) => {
    return {
      postId: value._id,
      user: value.user,
      title: value.title,
      createdAt: value.createdAt,
    };
  });
  res.json({ data: postPrint });
});

//게시글상세조회
//
router.get("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const post = await Posts.findOne({ _id: _postId }, { password: 0, _v: 0 });
    const postPrint = {
      postId: post._id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: createdAt,
    };
    res.json({ data: postPrint });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: "데이터  형식이 올바르지 않습니다." });
  }
});

//게시글수정
router.put("/postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    const [post] = await Posts.find({ _id: _postId });
    if (!post) {
      return res
        .status(404)
        .json({ message: "게시글 조회에  실패하였습니다." });
    }
    if (password === post.password) {
      await Posts.updateOne(
        { _id: _postId },
        { $set: { title: title, content: content } }
      );
      return res.status(200).json({ message: "게시글을 수정하였습니다." });
    } else {
      return res.status(404).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//게시글 삭제
router.delete("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { password } = req.body;
    const [post] = await Posts.find({ _id: _postId });

    if (!post) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }

    if (password === post.password) {
      await Posts.deleteOne({ _id: _postId });
      return res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } else {
      return res.status(404).json({ message: "비밀번호가 다릅니다." });
    }
  } catch {
    res.status(400).send(err.message);
  }
});

module.exports = router;
