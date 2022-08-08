import express from 'express';
import bodyParser from 'body-parser';
import { requestDB } from './request.js';

const app = express();
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function () {
    console.log('서버 실행중..');
});

app.get('/post/getPostOrderByTime', async (req, res) => {
    const currentTime = req.query.currentTime;
    const reqType = Number(req.query.reqType);
    const postType = req.query.postType;
    const currentIndex = String(req.query.currentIndex);
    const numberOfPost = String(req.query.num);
    let sql = '';
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    const CATEGORY_SEARCH = 1;
    const TITLE_SEARCH = 2;

    let params = [currentTime, postType];

    // const params = [postType]
    if (reqType === CATEGORY_SEARCH) {
        sql =
            'SELECT * FROM post WHERE created_at < ? AND type = ? AND category_id= ? ORDER BY created_at DESC LIMIT ';
        // sql = 'SELECT * FROM post WHERE created_at < ? AND type = ? AND category_id= ? and latitude between ? and ? AND longitude between ? and ? ORDER BY created_at DESC LIMIT ';
        params.push(req.query.categoryId);
    } else if (reqType === TITLE_SEARCH) {
        sql =
            'SELECT * FROM post WHERE created_at < ? AND type = ? AND title like ? ORDER BY created_at DESC LIMIT ';
        // sql = 'SELECT * FROM post WHERE created_at < ? AND type = ? AND title like ? and latitude between ? and ? AND longitude between ? and ? ORDER BY created_at DESC LIMIT ';
        const title = '%' + req.query.title + '%';
        params.push(title);
    } else {
        sql =
            'SELECT * FROM post WHERE created_at < ? AND  type = ?  ORDER BY created_at DESC LIMIT ';
        // sql = 'SELECT * FROM post WHERE created_at < ? AND type = ?  and latitude between ? and ? AND longitude between ? and ? ORDER BY created_at DESC LIMIT ';
    }

    // params.push(String(parseFloat(latitude)-0.15))
    // params.push(String(parseFloat(latitude)+0.15))
    // params.push(String(parseFloat(longitude)-0.15))
    // params.push(String(parseFloat(longitude)+0.15))

    sql = sql + numberOfPost + ' OFFSET ' + currentIndex;

    let response = await requestDB(sql, params);

    res.json(response);
});

app.get('/post/getPostByUserId', async (req, res) => {
    const sql = 'select * from post where user_id = ?';
    const userId = req.query.userId;

    const response = await requestDB(sql, userId);
    res.json(response);
});


app.get('/user/checkNickname', async (req, res) => {
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

app.get('/user/countUser', async (req, res) => {
    const sql = 'SELECT COUNT(*) as cnt FROM user';

    // 빈배열이 가능할까?
    let response = await requestDB(sql, []);

    const count = response.result[0]?.cnt;
    response.result = count;

    res.json(response);
});

app.get('/user/getInfoById', async (req, res) => {
    const id = req.query.id;
    const sql = 'select * from user where id =?';

    let response = await requestDB(sql, id);

    response.msg = response.result.length
        ? '저장된 유저 데이터 없음'
        : '/user/getInfoById succes';

    res.json(response);
});

app.get('/user/hasFbId', async (req, res) => {
    const id = req.query.id;
    const sql = 'select * from user where fb_id=?';
    const params = [id];

    let response = await requestDB(sql, params);

    if (!(response.length === 0)) {
        response.msg = '파이어베이스 아이디 존재';
        response.result = true;
    } else {
        response.msg = '파이어베이스 아이디 없음';
        response.result = false;
    }

    res.json(response);
});

app.post('/user/join', async (req, res) => {
    const fbId = req.body.fb_id;
    const email = req.body.email;
    const nickname = req.body.nickname;
    const homeAddr = req.body.home_addr;
    const reportPoint = req.body.report_point;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const createdAt = req.body.created_at;

    const sql =
        'insert into user (fb_id,email,nickname,home_addr,report_point,latitude,longitude,created_at) values (?,?,?,?,?,?,?,?)';
    const params = [
        fbId,
        email,
        nickname,
        homeAddr,
        reportPoint,
        latitude,
        longitude,
        createdAt,
    ];

    let response = await requestDB(sql, params);
    response.result = response.result.insertId;

    res.json(response);
});

app.post('/post/create', async (req, res) => {
    const title = req.body.title;
    const category_id = req.body.category_id;
    const user_id = req.body.user_id;
    const content = req.body.content;
    const type = req.body.type;
    const main_addr = req.body.main_addr;
    const addr_detail = req.body.addr_detail;
    const validate_type = req.body.validate_type;
    const validate_date = req.body.validate_date;
    const validate_img = req.body.validate_img;
    const product_img = req.body.product_img;
    const created_at = req.body.created_at;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const state = req.body.state;

    const sql =
        'insert into post (title, category_id, user_id, content, type, main_addr, addr_detail, product_img, validate_type, validate_date, validate_img, created_at, latitude, longitude, state)  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const params = [
        title,
        category_id,
        user_id,
        content,
        type,
        main_addr,
        addr_detail,
        product_img,
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

app.post('/post/review', async (req, res) => {
    const id = req.body.id;
    const review = req.body.review;
    const rate = req.body.rate;

    const sql = 'update post set review = ?, rate = ? where id = ?';
    const params = [review, rate, id];

    let response = await requestDB(sql, params);
    response.result = response.result.affectedRows;

    res.json(response);
});
