
// import serviceAccount from './firebaseKey.json' assert {type : "json"};
// import { admin } from 'firebase-admin/app';
import { FCM } from 'fcm-node';
//firebase-admin 과 차이 알아보고 수정예정
// const FCM = require('fcm-node');
const serverKey = ''; //서버키
const fcm = new FCM(serverKey);
// admin.initializeApp({
//     credential : admin.credential.cer(serviceAccount)
// });
export const requestFcm = function (token,title,content){
    
    const message = {
        to: token,  //db에서 가져온 토큰
        
        notification: {
            title: title, //알림 제목
            body: content //알림 내용
        }
        // ,
        // data: {  // 전송할 데이터가 추가로 있는 경우
        //     my_key: 'my value',
        //     my_another_key: 'my another value'
        // }
    };
    //오류처리
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}