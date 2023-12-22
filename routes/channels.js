const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, param, validationResult } = require('express-validator');

router.use(express.json());

// 콜백함수의 유효성 검사에 대한 에러내용을 함수로만들고 변수에 담아, 모듈화를 시켜서 미들웨어의 역할을 함.
const validate = (req, res, next) => {
  const err = validationResult(req);

  // err에 내용이 비었다면
  if (err.isEmpty()) {
    return next(); // 다음 할 일 => (미들웨어, 함수)
  } else {
    return res.status(400).json(err.array());
  }
};

router
  .route('/')

  // 채널 전체 조회 + 예외처리 + db연동 + 유효성검사
  .get(
    [body('userId').notEmpty().isInt().withMessage(`숫자를 입력해주세요.`), validate],
    (req, res) => {
      var { userId } = req.body;

      let sql = `SELECT * FROM channels WHERE user_id = ?`;
      conn.query(sql, userId, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.length) {
          res.status(200).json(results);
        } else {
          return res.status(400).end();
        }
      });
    }
  )

  // 채널 개별 등록 + 예외처리 + db연동 + 유효성검사
  .post(
    [
      body('userId').notEmpty().isInt().withMessage(`숫자를 입력해주세요.`),
      body('name').notEmpty().isString().withMessage(`문자를 입력해주세요.`),
      validate,
    ],
    (req, res) => {
      const { name, userId } = req.body;

      let sql = `INSERT INTO channels(name, user_id) VALUES (?, ?)`;
      let values = [name, userId];
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
  .route('/:id')
  // 채널 개별 조회 + 예외처리 + db연동 + 유효성검사
  .get([param('id').notEmpty().withMessage(`채널 id가 필요합니다.`), validate], (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    let sql = `SELECT * FROM channels WHERE id = ?`;
    conn.query(sql, id, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

      if (results.length) {
        res.status(200).json(results);
      } else {
        return res.status(400).end();
      }
    });
  })

  // 채널 개별 수정 + 예외처리 + db연동 + 유효성검사
  .put(
    [
      param('id').notEmpty().withMessage(`채널 id가 필요합니다.`),
      body('name').notEmpty().isString().withMessage(`채널명이 오류가 났습니다.`),
      validate,
    ],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);
      let { name } = req.body;

      let sql = `UPDATE channels SET name = ? WHERE id =?`;
      let values = [name, id];
      conn.query(sql, values, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        // UPDATE에 실패했을경우
        if (results.affectedRows == 0) {
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  )

  // 채널 개별 삭제  + 예외처리 + db연동 + 유효성검사
  .delete([param('id').notEmpty().withMessage(`채널 id가 필요합니다.`), validate], (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    let sql = `DELETE FROM channels WHERE id = ?`;
    conn.query(sql, id, function (err, results) {
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
  });

// function notFoundChannel(res) {
//   res.status(404).json({
//     message: `채널 정보를 찾을 수 없습니다.`,
//   });
// }

module.exports = router;
