const express = require('express');
const router = express.Router();
const conn = require('../mariadb');

router.use(express.json());

// 로그인 + 예외처리 + DB연동
router.post('/login', function (req, res) {
  const { email, password } = req.body;

  let sql = `SELECT * FROM users WHERE email = ?`; // sql문이라는걸 명시해주기 위해서!
  conn.query(sql, email, function (err, results) {
    var loginUser = results[0];

    if (loginUser && loginUser.password == password) {
      res.status(200).json({
        message: `${loginUser.name}님 로그인 되었습니다.`,
      });
    } else {
      res.status(404).json({
        message: `이메일 또는 비밀번호가 틀렸습니다.`,
      });
    }
  });
});

// 회원가입 + 예외처리 + DB연동
router.post('/join', function (req, res) {
  // req.body에 값이 없으면!
  if (req.body == {}) {
    res.status(400).json({
      message: `입력값을 다시 확인해 주세요.`,
    });
  } else {
    // 값이 있으면 ~
    const { email, name, password, contact } = req.body;

    let sql = `INSERT INTO users(email, name, password, contact) VALUES (?, ?, ?, ?)`;
    let values = [email, name, password, contact];
    conn.query(sql, values, function (err, results) {
      res.status(201).json(results);
    });
  }
});

router
  .route('/users') // url이 같은 메소드들을 묶어주는 기능 = route
  // 회원 개별 조회 + 예외처리 + DB연동
  .get(function (req, res) {
    let { email } = req.body;

    let sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, email, function (err, results) {
      res.status(200).json(results);
    });
  })

  // 회원 개별 탈퇴 + 예외처리 + DB연동
  .delete(function (req, res) {
    let { email } = req.body;

    let sql = `DELETE FROM users WHERE email = ?`;
    conn.query(sql, email, function (err, results) {
      res.status(200).json(results);
    });
  });

module.exports = router; // 모듈화
