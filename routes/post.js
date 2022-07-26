import { requestDB } from '../service/request.js';

import { sendEmail } from '../service/mailService.js';
import { uploadImage } from '../service/s3Service.js';
import express from 'express';
const router = express.Router();

router.get('/getInfoById', async(req,res) => {
    const id = req.query.id;
    const sql = 'select * from post where id = ?';
    let response = await requestDB(sql,id);
    response.msg = response.result.length
    ? '/post/getInfoById succes'
    : '저장된 포스트 데이터 없음';
    res.json(response);
});

router.get('/getPostOrderByTime', async (req, res) => {
    const pageSize = 12;
    const CATEGORY_SEARCH = 1;
    const TITLE_SEARCH = 2;

    const currentTime = req.query.currentTime;
    const reqType = Number(req.query.reqType);
    const postType = req.query.postType;
    const currentIndex = String((req.query.page-1)*pageSize);
    const numberOfPost = String(pageSize);
    let sql = '';
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;



    let params = [latitude, longitude, latitude, currentTime, postType];


    if (reqType === CATEGORY_SEARCH) {
        sql = 'SELECT *, (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)-radians(?))+sin(radians(?))*sin(radians(latitude)))) as distance FROM post WHERE created_at < ? AND type = ? AND category_id = ? AND completed_at IS NULL ORDER BY created_at DESC LIMIT ';
        params.push(req.query.categoryId);
    } else if (reqType === TITLE_SEARCH) {
        sql = 'SELECT *, (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)-radians(?))+sin(radians(?))*sin(radians(latitude)))) as distance FROM post WHERE created_at < ? AND type = ? AND title like ? AND completed_at IS NULL ORDER BY created_at DESC LIMIT ';
        const title = '%' + req.query.title + '%';
        params.push(title);
    } else {
        sql = 'SELECT *, (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)-radians(?))+sin(radians(?))*sin(radians(latitude)))) as distance FROM post WHERE created_at < ? AND type = ? AND completed_at IS NULL ORDER BY created_at DESC LIMIT ';
    }

    sql = sql + numberOfPost + ' OFFSET ' + currentIndex;

    let response = await requestDB(sql, params);

    res.json(response);
});

router.get('/getPostOrderByDistance', async (req, res) => {
    const currentTime = req.query.currentTime;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const params = [latitude,longitude,latitude,currentTime];
    const sql = 'select *, (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)-radians(?))+sin(radians(?))*sin(radians(latitude)))) as distance FROM post WHERE created_at < ? AND completed_at IS NULL ORDER BY distance LIMIT 0,6';

    const response = await requestDB(sql, params);

    res.json(response);
});

router.get('/getPostByUserId', async (req, res) => {
    const sql = 'select * from post where user_id = ?';
    const userId = req.query.userId;

    const response = await requestDB(sql, userId);
    res.json(response);
});


router.post('/create', async (req, res) => {
    const title = req.body.title;
    const category_id = req.body.category_id;
    const user_id = req.body.user_id;
    const content = req.body.content;
    const type = req.body.type;
    const main_addr = req.body.main_addr;
    const addr_detail = req.body.addr_detail;
    const validate_type = req.body.validate_type;
    const validate_date = req.body.validate_date;
    const validate_img = await (await uploadImage(Buffer.from(req.body.validate_img, 'base64'))).Location
    const image1 = await (await uploadImage(Buffer.from(req.body.image1, 'base64'))).Location
    // const image2 = req.body.image2;
    // const image3 = req.body.image3;
    const created_at = req.body.created_at;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const state = req.body.state;

    const sql =
        'insert into post (title, category_id, user_id, content, type, main_addr, addr_detail, image1, validate_type, validate_date, validate_img, created_at, latitude, longitude, state)  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        // 'insert into post (title, category_id, user_id, content, type, main_addr, addr_detail, image1, image2, image3, validate_type, validate_date, validate_img, created_at, latitude, longitude, state)  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
 
    const params = [
        title,
        category_id,
        user_id,
        content,
        type,
        main_addr,
        addr_detail,
        image1,
        // image2,
        // image3,
        validate_type,
        validate_date,
        validate_img,
        created_at,
        latitude,
        longitude,
        state,
    ];

    let response = await requestDB(sql, params);
    response.result = response.result.insertId;

    res.json(response);
});

router.post('/completeTrade', async(req,res) => {
    const id = req.body.id;
    const completeAt = req.body.completedAt;
    const sql = 'update post set completed_at = ? where id = ?';
    const params = [completeAt,id];
    let response = await requestDB(sql,params);
    response.result = response.result.affectedRows;
    res.json(response);
});

router.post('/sendMail', async(req,res) => {
    const id = req.body.id;
    const content = req.body.content;
    const postId = req.body.postId;
    
    const sql = 'update mainDB.user set report_point = mainDB.user.report_point+1 where id = (select user_id from mainDB.post where id = ?)';
    
    if(postId != 0 ){
        requestDB(sql, postId).then(function(DBresolved){
            /*console.log(DBresolved);*/
        }).catch(function(error){
            console.log("sql 입력 실패");
            res.json(error);
        });
}
    sendEmail(id,postId,content).then(function(resolvedData){
        res.json(resolvedData);
        console.log("전송완료");
    }).catch(function(error){
        res.json(error);
        console.log("전송실패");
    });


});

router.post('/review', async (req, res) => {
    const id = req.body.id;
    const review = req.body.review;
    const rate = req.body.rate;

    const sql = 'update post set review = ?, rate = ? where id = ?';
    const params = [review, rate, id];

    let response = await requestDB(sql, params);
    response.result = response.result.affectedRows;

    res.json(response);
});



export default router;