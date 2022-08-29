import { requestDB } from './request.js';
import express from 'express';
import { requestFcm } from './fcmService.js';

const router = express.Router();


//메시지 보내기
router.post('/sendMessage',async (req,res)=>{
    const chatId = req.body.chatId;
    const message = req.body.message;
    const title = "보낸사람: " + req.body.fromId;
    const toId = req.body.toID;
    const createdAt = req.body.createdAt;
    const params = [chatId,createdAt,message,req.body.fromId];

    //fcm에 정보 전달
    let sql = 'select fcm_token from user where id = ?';
    let response = await requestDB(sql,toId);
    const token = response.result[0].fcm_token;
    requestFcm(token, title, message);

    //메시지 디비에 삽입
    sql = 'insert into message (chat_id, created_at, content, from) value (?,?,?,?)';
    response = await requestDB(sql,params);

    console.log(response.msg);
});

router.post('/makeChat',async (req,res)=>{
    const postId = req.body.postId;
    const contactId = req.body.contactId;
    const id = req.body.id;
    const chatId = String(postId) + contactId;
    const createdAt = req.body.createdAt;

    let sql = 'select from chat where id = ?';
    let response = await requestDB(sql,chatId);
    if (response.result.length === 0 ){
        sql = 'insert into chat (id, post_id, user_id, created_at) value (?,?,?,?)';
        const params = [id,postId,contactId,createdAt];
        response = await requestDB(sql,params);
        console.log("new chat created successfully");

    }
    else{
        console.log("chatId is already in use");
    }
})