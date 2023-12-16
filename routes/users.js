// express 모듈 셋팅 + 모듈화
const express = require('express');
// const app = express();
// app.listen(7777);
const router = express.Router(); // app.js
router.use(express.json()); // http 외 모듈 'json'

let db = new Map();
var id = 1; // 하나의 객체를 유니크하게 구별하기 위함.

// 로그인 + 예외처리
router.post('/login', function (req, res) {
  console.log(req.body); // userId, pwd를 받아옴

  // userId가 db에 저장된 회원인지 확인!
  const { userId, password } = req.body;
  var loginUser = {};

  db.forEach(function (user, id) {
    if (user.userId === userId) {
      loginUser = user;
    }
  });
  // userId 값을 찾았다면()
  if (isExist(loginUser)) {
    console.log('같은거 찾았다!');

    // pwd도 맞는지 비교!
    if (loginUser.password === password) {
      console.log('패스워드도 같다!');
    } else {
      console.log('패스워드는 틀렸다!');
    }
  } else {
    // userId 값을 못 찾았다면..
    console.log('아이디를 다시 확인해주세요.');
  }
});

function isExist(obj) {
  if (Object.keys(obj).length) {
    return true;
  } else {
    return false;
  }
}

// 회원가입 + 예외처리
router.post('/join', function (req, res) {
  console.log(req.body);

  if (req.body == {}) {
    res.status(400).json({
      message: `입력값을 다시 확인해 주세요.`,
    });
  } else {
    db.set(id++, req.body);

    res.status(201).json({
      message: `${db.get(id - 1).name}님 환영합니다.!`,
    });
  }
});

router
  .route('/users/:id') // url이 같은 메소드들을 묶어주는 기능

  // 회원 개별 조회
  .get(function (req, res) {
    let { id } = req.params;
    id = parseInt(id);

    // console.log(id);
    const user = db.get(id);
    if (user == undefined) {
      res.status(404).json({
        message: `회원 정보가 없습니다.`,
      });
    } else {
      res.status(200).json({
        userId: user.userId,
        name: user.name,
      });
    }
  })

  // 회원 개별 탈퇴
  .delete(function (req, res) {
    let { id } = req.params;
    id = parseInt(id);

    const user = db.get(id);
    if (user == undefined) {
      res.status(404).json({
        message: `회원 정보가 없습니다.`,
      });
    } else {
      db.delete(id);

      res.status(200).json({
        message: `${user.name}님 다음에 또 뵙겠습니다.`,
      });
    }
  });

module.exports = router; // 다른 파일에서 사용이 가능하게끔
