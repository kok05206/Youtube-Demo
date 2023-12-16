// express 모듈 셋팅
const express = require('express');
// const app = express();
// app.listen(7777);
const router = express.Router();
router.use(express.json());

let db = new Map();
var id = 1;

router
  .route('/')
  // 채널 전체 조회 + 예외처리
  .get((req, res) => {
    if (db.size) {
      var channels = [];

      db.forEach(function (value, key) {
        channels.push(value);
      });
      res.status(200).json(channels);
    } else {
      res.status(404).json({
        message: `조회할 채널이 없습니다.`,
      });
    }
  })
  // 채널 개별 생성 + 예외처리 = db에 저장
  .post((req, res) => {
    if (req.body.channelTitle) {
      db.set(id++, req.body);

      res.status(201).json({
        message: `${db.get(id - 1).channelTitle} 채널을 응원합니다!`,
      });
    } else {
      res.status(400).json({
        message: `요청 값을 제대로 보내주세요.`,
      });
    }
  });

router
  .route('/:id')
  // 채널 개별 조회
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var channel = db.get(id);
    if (channel) {
      res.status(200).json(channel);
    } else {
      res.status(404).json({
        message: `채널 정보를 찾을 수 없습니다.`,
      });
    }
  })
  // 채널 개별 수정
  .put((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var channel = db.get(id);
    var oldTitle = channel.channelTitle;
    if (channel) {
      var newTitle = req.body.channelTitle;

      channel.channelTitle = newTitle;
      db.set(id, channel);

      res.json({
        message: `채널명이 정상적으로 수정되었습니다. 기존 채널명 : ${oldTitle} -> 수정된 채널명 : ${newTitle}`,
      });
    } else {
      res.status(404).json({
        message: `채널 정보를 찾을 수 없습니다.`,
      });
    }
  })
  // 채널 개별 삭제
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var channel = db.get(id);
    if (channel) {
      db.delete(id);
      res.status(200).json({
        message: `${channel.channelTitle}이 정상적으로 삭제되었습니다.`,
      });
    } else {
      res.status(404).json({
        message: `채널 정보를 찾을 수 없습니다.`,
      });
    }
  });

module.exports = router;
