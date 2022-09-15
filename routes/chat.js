import { requestDB } from '../service/request.js';
import express from 'express';
import { requestFcm } from '../service/fcmService.js';

const router = express.Router();


//메시지 보내기
router.post('/sendMessage',async (req,res)=>{
    const chatId = req.body.chatId;
    const message = req.body.content;
    const from = req.body.from;
    const createdAt = req.body.created_at;

    const title = "보낸사람: " + from;
    let toId = from;
    const params = [chatId,createdAt,message,from];

    //join 으로 채팅에 참여한 사람들 아이디 2개 가져온 후, 메시지를 보낸 사람과 비교해 메시지를 보낸 사람이 아닌 사람(즉, 메시지를 받는 사람)에게 알림 전송
    let sql = 'select P.user_id as writer_id, C.user_id as contact_id from chat C join post P on C.post_id =P.id where C.id = ?';
    let response = await requestDB(sql,chatId);
    if (response.result[0].writed_id == from){
        toId = response.result[0].contact_id;
    }
    else {
        toId = response.result[0].writer_id;
    }

    //fcm에 메시지 받는사람 fcm_token 정보 전달
    sql = 'select fcm_token from user where id = ?';
    response = await requestDB(sql,toId);
    const token = response.result[0].fcm_token;
    requestFcm(token, title, message);

    //메시지 디비에 삽입
    sql = 'insert into message (chat_id, created_at, content, from) value (?,?,?,?)';
    response = await requestDB(sql,params);
    response.reusult = 1;
    console.log(response.msg);
    res.json(response);
});

router.post('/make',async (req,res)=>{
    const postId = req.body.postId;
    const contactId = req.body.contactId;
    const id = req.body.id;
    const createdAt = req.body.createdAt;
    const chatId = String(postId) + contactId;


    let sql = 'select from chat where id = ?';
    let response = await requestDB(sql,chatId);
    if (response.result.length === 0 ){
        sql = 'insert into chat (id, post_id, user_id, created_at) value (?,?,?,?)';
        const params = [id,postId,contactId,createdAt];
        response = await requestDB(sql,params);
        console.log("new chat created successfully");
        response.reusult = 1;
        
    }
    else{
        console.log("chatId is already in use");
        response.result = 0;
    }
    res.json(response);
});

export default router;