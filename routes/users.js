const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, validationResult } = require('express-validator');

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  // err에 내용이 비었다면
  if (err.isEmpty()) {
    return next(); // 다음 할 일 => (미들웨어, 함수)
  } else {
    return res.status(400).json(err.array());
  }
};

// 로그인 + 예외처리 + db연동 + 유효성검사
router.post(
  '/login',
  [
    body('email').notEmpty().isEmail().withMessage(`이메일 형식을 확인해주세요.`),
    body('password').notEmpty().isString().withMessage(`비밀번호를 확인해주세요.`),
    validate,
  ],
  function (req, res) {
    const { email, password } = req.body;

    let sql = `SELECT * FROM users WHERE email = ?`; // sql문이라는걸 명시해주기 위해서!
    conn.query(sql, email, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

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
  }
);

// 회원가입 + 예외처리 + db연동 + 유효성검사
router.post(
  '/join',
  [
    body('email').notEmpty().isEmail().withMessage(`이메일 형식을 확인해주세요.`),
    body('name').notEmpty().isString().withMessage(`이름을 확인해주세요.`),
    body('password').notEmpty().isString().withMessage(`비밀번호를 확인해주세요.`),
    body('contact').notEmpty().isString().withMessage(`연락처를 확인해주세요.`),
    validate,
  ],
  function (req, res) {
    const { email, name, password, contact } = req.body;

    let sql = `INSERT INTO users(email, name, password, contact) VALUES (?, ?, ?, ?)`;
    let values = [email, name, password, contact];
    conn.query(sql, values, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      } else {
        res.status(201).json(results);
      }
    });
  }
);

router
  .route('/users') // url이 같은 메소드들을 묶어주는 기능 = route

  // 회원 개별 조회 + 예외처리 + db연동 + 유효성검사
  .get(
    [body('email').notEmpty().isEmail().withMessage(`이메일 형식을 확인해주세요.`), validate],
    function (req, res) {
      let { email } = req.body;

      let sql = `SELECT * FROM users WHERE email = ?`;
      conn.query(sql, email, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  )

  // 회원 개별 탈퇴 + 예외처리 + db연동 + 유효성검사
  .delete(
    [body('email').notEmpty().isEmail().withMessage(`이메일 형식을 확인해주세요.`), validate],
    function (req, res) {
      let { email } = req.body;

      let sql = `DELETE FROM users WHERE email = ?`;
      conn.query(sql, email, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        // DELETE에 실패했을경우
        if (results.affectedRows == 0) {
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  );

module.exports = router; // 모듈화
