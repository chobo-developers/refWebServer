
// import serviceAccount from './firebaseKey.json' assert {type : "json"};
// import { admin } from 'firebase-admin/app';

//firebase-admin 과 차이 알아보고 수정예정
// const FCM = require('fcm-node');

// admin.initializeApp({
//     credential : admin.credential.cer(serviceAccount)
// });

// import { FCM } from 'fcm-node';



// import pkg from 'fcm-node';

// const { FCM } = pkg;
// const serverKey = 'fyghj'; //서버키
// const fcm = new FCM(serverKey);
// export const requestFcm = function (token,title,content){
    
//     const message = {
//         to: token,  //db에서 가져온 토큰
        
//         notification: {
//             title: title, //알림 제목
//             body: content //알림 내용
//         }
//         // ,
//         // data: {  // 전송할 데이터가 추가로 있는 경우
//         //     my_key: 'my value',
//         //     my_another_key: 'my another value'
//         // }
//     };
//     //오류처리
//     fcm.send(message, function(err, response){
//         if (err) {
//             console.log("Something has gone wrong!");
//         } else {
//             console.log("Successfully sent with response: ", response);
//         }
//     });
// }

import admin from 'firebase-admin';
import serviceAccount from '../service-account-file.json' assert {type : "json"};
import express from 'express';
const router = express.Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });



router.get('/test', (req, res, next) => {
    let idx = String(req.body.idx);
    let title = req.body.title;
    let body = req.body.body;

    let target_token =
        '토큰 값..';

    let message = {
        data: {
        title: 'test title',
        body : 'test body',
        },
        token: target_token,
    }

    admin
        .messaging()
        .send(message)
        .then(function (response) {
        res.status(200).send("push success");
        console.log('Successfully sent message: : ', response)
        })
        .catch(function (err) {
        console.log('Error Sending message!!! : ', err)
        })
    });

export default router;
