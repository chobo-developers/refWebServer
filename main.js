import express from 'express';
import bodyParser from 'body-parser';
import { response } from 'express';
import { requestDB } from './request'

const app = express();
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function () {
    console.log('서버 실행중..');
});

app.get('/post/getPostOrderByTime', async (req, res) => {
    var currentTime = req.query.currentTime;
    var reqType = Number(req.query.reqType);
    var postType = req.query.postType;
    var currentIndex = String(req.query.currentIndex);
    var numberOfPost = String(req.query.num);
    var sql = '';
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    const CATEGORY_SEARCH = 1;
    const TITLE_SEARCH = 2;

    var params = [currentTime, postType];
    // var params = [postType]

    // var params = [postType]
    if (reqType === CATEGORY_SEARCH) {
        sql =
            'SELECT * FROM post WHERE created_at < ? AND type = ? AND category_id= ? ORDER BY created_at DESC LIMIT ';
        // sql = 'SELECT * FROM post WHERE created_at < ? AND type = ? AND category_id= ? and latitude between ? and ? AND longitude between ? and ? ORDER BY created_at DESC LIMIT ';
        params.push(req.query.categoryId);
    } else if (reqType === TITLE_SEARCH) {
        sql =
            'SELECT * FROM post WHERE created_at < ? AND type = ? AND title like ? ORDER BY created_at DESC LIMIT ';
        // sql = 'SELECT * FROM post WHERE created_at < ? AND type = ? AND title like ? and latitude between ? and ? AND longitude between ? and ? ORDER BY created_at DESC LIMIT ';
        title = '%' + req.query.title + '%';
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

    const response = await requestDB(sql, params);

    res.json(response);
});

app.get('/post/getPostByUserId', async (req, res) => {
    var sql = 'select * from post where user_id = ?';
    var userId = req.query.userId;

    const response = await requestDB(sql, userId);
    res.json(response);
});

app.get('/user/checkNickname', async (req, res) => {
    var nickname = req.query.nickname;
    var sql = 'SELECT * FROM user WHERE nickname = ?';

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
    var sql = 'SELECT COUNT(*) as cnt FROM user';

    // 빈배열이 가능할까?
    let response = await requestDB(sql, []);

    const count = response.result[0]?.cnt;
    response.result = count;

    res.json(response);
});

app.get('/user/getInfoById', async (req, res) => {
    var id = req.query.id;
    var sql = 'select * from user where id =?';

    let response = await requestDB(sql, id);

    response.msg = response.result.length
        ? '저장된 유저 데이터 없음'
        : '/user/getInfoById succes';

    res.json(response);
});

app.get('/user/hasFbId', async (req, res) => {
    var id = req.query.id;
    var sql = 'select fb_id from user where id=?';
    var params = [id];

    let response = await requestDB(sql, params);

    if (!!response[0]?.fb_id) {
        response.msg = '파이어베이스 아이디 존재';
        response.hasFb = true;
    } else {
        response.msg = '파이어베이스 아이디 없음';
        response.hasFb = false;
    }

    res.json(response);
});

app.post('/user/join', async (req, res) => {
    var fbId = req.body.fb_id;
    var email = req.body.email;
    var nickname = req.body.nickname;
    var homeAddr = req.body.home_addr;
    var reportPoint = req.body.report_point;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var createdAt = req.body.created_at;

    var sql =
        'insert into user (fb_id,email,nickname,home_addr,report_point,latitude,longitude,created_at) values (?,?,?,?,?,?,?,?)';
    var params = [
        fbId,
        email,
        nickname,
        homeAddr,
        reportPoint,
        latitude,
        longitude,
        createdAt,
    ];

    response = await requestDB(sql, params);
    response.result = response.result.insertId;

    res.json(response);
});

app.post('/post/create', async (req, res) => {
    var title = req.body.title;
    var category_id = req.body.category_id;
    var user_id = req.body.user_id;
    var content = req.body.content;
    var type = req.body.type;
    var main_addr = req.body.main_addr;
    var addr_detail = req.body.addr_detail;
    var validate_type = req.body.validate_type;
    var validate_date = req.body.validate_date;
    var validate_img = req.body.validate_img;
    var product_img = req.body.product_img;
    var created_at = req.body.created_at;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var state = req.body.state;

    var sql =
        'insert into post (title, category_id, user_id, content, type, main_addr, addr_detail, product_img, validate_type, validate_date, validate_img, created_at, latitude, longitude, state)  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var params = [
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

    response = await requestDB(sql, params);
    response.result = response.result.insertId;

    res.json(response);
});

app.post('/post/review', async (req, res) => {
    var id = req.body.id;
    var review = req.body.review;
    var rate = req.body.rate;

    var sql = 'update post set review = ?, rate = ? where id = ?';
    var params = [review, rate, id];

    response = await requestDB(sql, params);
    response.result = response.result.affectedRows;

    res.json(response);
});
