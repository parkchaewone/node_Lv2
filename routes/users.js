// routes/users.js
const express = require("express");
const router = express.Router();

const User = require("../schemas/user");
const authMiddleware = require("../middlewares/middleware");

// 내 정보 조회 API
router.get("/users/me", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;

  res.status(200).json({
    user: { nickname },
  });
});

// 회원가입 API
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;
  //유효성 검사: 닉네일 길이검사 3자이상
  // if (nickname.length <= 3 || !/^[a-zA-Z0-9]+$/.test(nickname))
  //   res.json({
  //     Message: "닉네임은 3자이상 대소문자와 숫자가 포함되어야 합니다",
  //   });
  if (nickname.length < 3 || !/^[a-zA-Z0-9]+$/.test(nickname)) {
    return res.status(412).json({
      errorMessage:
        "닉네임은 최소 3자 이상이며, 알파벳 대소문자와 숫자로만 구성되어야 합니다.",
    });
  }

  //유효성검사 :비밀번호는 4자이상, 닉네임이랑 같은값포함일경우 회원가입실패
  if (password.length <= 3 || password.includes(nickname)) {
    return res.status(412).json({
      errorMessage:
        "패스워드는 최소 4자 이상이어야 하며, 닉네임과 동일한 값을 포함할 수 없습니다.",
    });
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  //  nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findOne({ nickname });

  if (existsUsers) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
    res.status(400).json({
      errorMessage: " 중복된 닉네임입니다.",
    });
    return;
  }

  const user = new User({ nickname, password });
  await user.save();

  res.status(201).json({ Message: "회원가입완료!" });
});

module.exports = router;
