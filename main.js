import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
const app = express();


app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user',userRouter);
app.use('/post',postRouter);
app.listen(3000, function () {
    console.log('서버 실행중..');
});
