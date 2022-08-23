
import serviceAccount from './firebaseKey.json' assert {type : "json"};
import { admin } from 'firebase-admin/app';

const FCM = require('fcm-node');
const serverKey = ''; //서버키
const fcm = new FCM(serverKey);

export const requestFcm = function (token,title,content){
    
    const message = {
        to: token,  //앱에서 복사한 토큰 
        
        notification: {
            title: title, //알림 제목
            body: content //알림 내용
        },
        
        data: {  // 전송할 데이터가 추가로 있는 경우
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}