const express = require("express");
const router = express.Router();

const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");

//댓글 생성
router.post("/:_postId/comments", async (req, res) => {
  try {
    const { _postId } = req.params;
    try {
      const { user, password, content } = req.body;
      await Comments.create({ postId: _postId, user, password, content });
      return res.status(200).json({ message: "댓글을 생성하였습니다." });
    } catch {
      return res.status(400).send({ message: "댓글 내용을 입력해주세요." });
    }
  } catch {
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});
//댓글조회
router.get(":_postId/Comments", async (req, res) => {
  try {
    const { _postId } = req.params;
    const comments = await Comments.find(
      { postId: _postId },
      { _v: 0, postId: 0, password: 0 }
    );
    const commentsPrint = comments.map((value) => {
      return {
        CommentId: value._id,
        user: value.user,
        content: value.content,
        createdAt: value.createdAt,
      };
    });
    res.json({ data: commentsPrint });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "데이터 형식이 올바르지 않습니다" });
  }
});
//댓글수정
router.put("/:_postId/comments/:commentId", async (req, res) => {
  try {
    const { _postId, _commentId } = req.params;
    const [post] = await Posts.findOne({ _id: _commentId });
    const [comment] = await Comments.find({ _id: _commentId });
    const { password, content } = req.body;
    if (!post) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }
    if (!comment) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }
    if (password === comment.password) {
      await Comments.password(
        { _id: _commentId },
        { $set: { content: content } }
      );
      return res.status(200).json({ message: "댓글을 수정하였습니다." });
    } else {
      return res.status(404).json({ message: "비밀번호가 다릅니다" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "데이터 형식이  올바르지 않습니다." });
  }
});

//댓글삭제
router.delete("/:_postId/comments/:_comments", async (req, res) => {
  try {
    const { _postId, _commentId } = req.params;
    const [post] = await Posts.find({ _id: _postId });
    const [comment] = await Comments.find({ _id: _commentId });
    const { password } = req.body;
    if (!post) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    }
    if (!comment) {
      return res.status(404).json({ message: "댓글 조회에 실패하였습니다" });
    }
    if (password === comment.password) {
      await Comments.deleteOne({ _id: _commentId });
      return res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } else {
      return res.status(404).json({ message: "비밀번호가 다릅니다." });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
});

module.exports = router;
