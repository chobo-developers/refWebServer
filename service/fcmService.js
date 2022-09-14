
//fcm service 구현중

import admin from 'firebase-admin';
import serviceAccount from '../service-account-file.json' assert {type : "json"};
import express from 'express';
const router = express.Router();



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

//fcm 토큰으로 메시지 보내기 write by copliot
router.post('/send', async (req, res) => {
    const fcmToken = req.body.fcmToken;
    const message = req.body.message;
    const payload = {
        notification: {
            title: 'FCM Message',
            body: message,
            sound: 'default'
        }
    };
    const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24
    };
    admin.messaging().sendToDevice(fcmToken, payload, options)

    res.json({result : true});
});



router.post('/test', (req, res, next) => {
    let title = req.body.title;
    let body = req.body.body;
    let target_token =
        req.body.token;

    let message = {
        data: {
        title: title,
        body : body,
        },
        token: target_token,
    }
    admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);
        res.status(200).send('success');
    })
    .catch((error) => {
        console.log('Error sending message:', error);
        res.status(500).send('error');
    });
    });

export default router;
