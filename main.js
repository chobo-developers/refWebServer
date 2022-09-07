import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
import chatRouter from './routes/chat.js';
import testRouter from './service/fcmService.js';

const app = express();


app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user',userRouter);
app.use('/post',postRouter);
app.use('/fcm',testRouter);
app.use('/chat',chatRouter);
app.listen(3000, function () {
    console.log('서버 실행중..');
});
