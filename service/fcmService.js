
//fcm service 구현중

import admin from 'firebase-admin';
import serviceAccount from '../service-account-file.json' assert {type : "json"};
// import express from 'express';
// const router = express.Router();



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
export const requestFcm = async (token, title, message) => {
    console.log(token);
    const fcmToken = token;
    const messaget = message;
    const titlet = title;
    const payload = {
        notification: {
            title: titlet,
            body: messaget,
            sound: 'default'
        },
        data: {
            title: titlet,
            body : messaget,
            },
    };
    const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24
    };
    admin.messaging().sendToDevice(fcmToken, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
};
// //fcm 토큰으로 메시지 보내기 written by copliot
// router.post('/send', async (req, res) => {
//     const fcmToken = req.body.token;
//     const message = req.body.body;
//     const title = req.body.title;
//     const payload = {
//         notification: {
//             title: title,
//             body: message,
//             sound: 'default'
//         },
//         data: {
//             title: title,
//             body : message,
//             },
//     };
//     const options = {
//         priority: 'high',
//         timeToLive: 60 * 60 * 24
//     };
//     admin.messaging().sendToDevice(fcmToken, payload, options)
//     .then((response) => {
//       console.log('Successfully sent message:', response);
//     })
//     .catch((error) => {
//       console.log('Error sending message:', error);
//     });
//     res.json({result : true});
// });



// router.post('/test', (req, res, next) => {
//     let title = req.body.title;
//     let body = req.body.body;
//     let target_token =
//         req.body.token;

//     let message = {
//         notification: {
//             title: title,
//             body: body,
//         },
//         data: {
//         title: title,
//         body : body,
//         },
//         token: target_token,
//     }
//     admin.messaging().send(message)
//     .then((response) => {
//         console.log('Successfully sent message:', response);
//         res.status(200).send('success');
//     })
//     .catch((error) => {
//         console.log('Error sending message:', error);
//         res.status(500).send('error');
//     });
//     });

