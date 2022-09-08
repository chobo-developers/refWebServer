
//fcm service 구현중

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
        req.body.token

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
