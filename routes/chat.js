import { requestDB } from './request.js';
import express from 'express';
import serviceAccount from './firebaseKey.json' assert {type : "json"};
import { admin } from 'firebase-admin/app';


const router = express.Router();

router.post('/makeChat',async (req,res)=>{
    const fromId = res.body.fromId;
    const message = res.body.message;
    const toId = res.body.toID;
    /* 
    1.포스트 id 받으면 toid 로 채팅 있는 지 검색
    2.
    
    */

    

});