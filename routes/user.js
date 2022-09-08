import { requestDB } from '../service/request.js';
import express from 'express';

const router = express.Router();

router.get('/getInfoById', async (req, res) => {
    const id = req.query.id;
    const sql = 'select * from user where id =?';

    let response = await requestDB(sql, id);

    response.msg = response.result.length
        ? '/user/getInfoById succes'
        : '저장된 유저 데이터 없음';

    res.json(response);
});

router.get('/getInfoByFbId', async (req, res) => {
    const fbId = req.query.fbId;
    const sql = 'select * from user where fb_id =?';

    let response = await requestDB(sql, fbId);

    response.msg = response.result.length
        ? '/user/getInfoById succes'
        : '저장된 유저 데이터 없음';

    res.json(response);
});

router.post('/updateFcmToken', async(req,res) => {

    const id = req.body.id;
    const fcmToken = req.body.data;
    const sql = 'update user set fcm_token = ? where id = ?';
    const params = [fcmToken,id];
    let response = await requestDB(sql,params);
    response.result = response.result.affectedRows;
    res.json(response);

});


router.get('/checkNickname', async (req, res) => {
    const nickname = req.query.nickname;
    const sql = 'SELECT * FROM user WHERE nickname = ?';

    let response = await requestDB(sql, nickname);


    if (response.result.length === 0) {
        response.result = false;
        response.msg = '중복된 닉네임 없음';
    } else {
        response.result = true;
        response.msg = '중복된 닉네임 있음';
    }

    res.json(response);
});

router.get('/countUser', async (req, res) => {
    const sql = 'SELECT COUNT(*) as cnt FROM user';

    // params 오버라이딩 하지않고 그냥 빈 배열 입력
    let response = await requestDB(sql, []);

    const count = response.result[0]?.cnt;
    response.result = count;

    res.json(response);
});


router.get('/hasFbId', async (req, res) => {
    const id = req.query.id;
    const sql = 'select * from user where fb_id=?';
    const params = [id];

    let response = await requestDB(sql, params);
    if ((response.result.length === 0)) {
        response.msg = '파이어베이스 아이디 없음';
        response.result = false;
    } else {
        response.msg = '파이어베이스 아이디 있음';
        response.result = true;
    }

    res.json(response);
});

router.post('/join', async (req, res) => {
    const fbId = req.body.fb_id;
    const email = req.body.email;
    const nickname = req.body.nickname;
    const homeAddr = req.body.home_addr;
    const reportPoint = req.body.report_point;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const createdAt = req.body.created_at;
    const fcmToken = req.body.fcm;

    const sql =
        'insert into user (fb_id,email,nickname,home_addr,report_point,latitude,longitude,created_at,fcm_token) values (?,?,?,?,?,?,?,?,?)';
    const params = [
        fbId,
        email,
        nickname,
        homeAddr,
        reportPoint,
        latitude,
        longitude,
        createdAt,
        fcmToken
    ];

    let response = await requestDB(sql, params);
    response.result = response.result.insertId;

    res.json(response);
});


router.post('/updateNickname', async (req, res) => {
    const id = req.body.id;
    const nickname = req.body.data;
    

    const sql = 'update user set nickname = ? where id = ?';
    const params = [nickname, id];

    let response = await requestDB(sql, params)
    response.result = response.result.affectedRows?
    '성공'
    :'실패';

    res.json(response);
});

//delete 임시
router.delete('', async (req, res) => {
    const id = req.query.id;
    const sql = 'delete from user where id = ?';

    let response = await requestDB(sql, id);
    response.result = response.result.affectedRows
    ? true : false ;

    res.json(response);
});



export default router;

