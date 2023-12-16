const express = require('express');
const app = express();

app.listen(7777);

// user-demo 소환
const userRouter = require('./routes/users');
app.use('/', userRouter);
// channel-demo 소환?
const channelRouter = require('./routes/channels');
app.use('/channels', channelRouter);
