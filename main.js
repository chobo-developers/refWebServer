var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var info = require('./info.json');
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000,function()
{
    console.log('서버 실행중..');
}
);

var connection = mysql.createConnection(
{
    host : info.host,
    user : info.user,
    database : info.database,
    password : info.password,
    port : info.port
}
);


app.get('/post/getPostOrderByTime',function(req,res){
    var currentTime = req.query.currentTime;
    var reqType = req.query.reqType;
    var postType = req.query.postType;
    var currentIndex = String(req.query.currentIndex);
    var numberOfPost = String(req.query.num);
    var sql ='';
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    var params = [currentTime,postType]
    // var params = [postType]
    if(reqType == 1){
        sql = 'SELECT * FROM post WHERE created_at < ? AND type = ? AND category_id= ? ORDER BY created_at DESC LIMIT ';
        // sql = 'SELECT * FROM post WHERE created_at < ? AND type = ? AND category_id= ? and latitude between ? and ? AND longitude between ? and ? ORDER BY created_at DESC LIMIT ';
        params.push(req.query.categoryId);

    }
    else if(reqType == 2){
        sql = 'SELECT * FROM post WHERE created_at < ? AND type = ? AND title like ? and latitude between ? and ? AND longitude between ? and ? ORDER BY created_at DESC LIMIT ';
        // sql = 'SELECT * FROM post WHERE created_at < ? AND type = ? AND title like ? and latitude between ? and ? AND longitude between ? and ? ORDER BY created_at DESC LIMIT ';
        title = '%'+req.query.title+'%'
        params.push(title);

    }
    else {
        sql = 'SELECT * FROM post WHERE created_at < ? AND  type = ?  ORDER BY created_at DESC LIMIT ';
        // sql = 'SELECT * FROM post WHERE created_at < ? AND type = ?  and latitude between ? and ? AND longitude between ? and ? ORDER BY created_at DESC LIMIT ';

    }
    // params.push(String(parseFloat(latitude)-0.15))
    // params.push(String(parseFloat(latitude)+0.15))
    // params.push(String(parseFloat(longitude)-0.15))
    // params.push(String(parseFloat(longitude)+0.15))
    
    sql = sql+numberOfPost+" OFFSET "+currentIndex;
    connection.query(sql,params,function(err,result){
        var isConnect = false;
        var resultCode = 404;
        var msg = "연결 실패";
        var result1 = null;
        if(err){
            console.log(err);
        }
        else{
            console.log("/post/getPostOrderByTime success");
            isConnect=true;
            resultCode= 200;
            msg= "연결 성공";
            result1 = result;
        }
        res.json({
            'isConnect' : isConnect,
            'resultCode' : resultCode,
            'msg': msg,
            'result' : result1
        });
    });

});

app.get('/post/getPostByUserId',function(req,res)
{
    var sql = "select * from post where user_id = ?";
    var userId = req.query.userId;
    connection.query(sql,userId,function(err,result){
        var isConnect = false;
        var resultCode = 404;
        var msg = "연결 실패";
        var result1 = null;

        if(err){
            console.log(err);
        }
        else{
            console.log("/post/getPostByUserId success");
            isConnect=true;
            resultCode= 200;
            msg= "연결 성공";
            result1 = result;
        }
        res.json({
            'isConnect' : isConnect,
            'resultCode' : resultCode,
            'msg': msg,
            'result' : result1
        });
    });
}
);

app.get('/user/checkNickname',function(req,res)
{
    
    var nickname = req.query.nickname;
    var sql = "SELECT * FROM user WHERE nickname = ?";


    connection.query(sql,nickname,function(err,result)
    {   
        var isConnect = false;
        var resultCode = 404;
        var msg = "연결 실패";
        var isExist = true;
        if(err){
            console.log(err);
        }
        else{
            isConnect = true;
            resultCode = 200;
            console.log("/user/checkNickname success")
            if (result.length == 0){
                isExist = false;
                msg = "중복된 닉네임 없음";
                console.log(msg);
                
            }
            else{
                isExist = true;
                msg = "중복된 닉네임 있음";
                console.log(msg);
            }
        }
        res.json(
            {
                'isConnect' : isConnect,
                'resultCode' : resultCode,
                'msg': msg,
                'isExist' : isExist
            }
        );
    }
    );

}
);

app.get('/user/countUser', function(req,res)
{
    
    var sql = "SELECT COUNT(*) as cnt FROM user";


    

    
    connection.query(sql,function(err,result)
    {   
        var isConnect = false;
        var resultCode = 404;
        var count = 0;
        var msg = "연결 실패";
        if(err){
            console.log(err);
        }
        else{
            console.log('/user/countUser');
            isConnect = true;
            resultCode = 200;
            count = result[0]['cnt'];
            msg = "연결 성공";
        }
        res.json(
            {
                'isConnect' : isConnect,
                'resultCode' : resultCode,
                'msg': msg,
                'count' : count
            }
        );
    }
    );
}
);


app.get('/user/hasFbId', function(req,res){
    var id = req.query.id;
    var sql = 'select fb_id from user where id=?';
    var params = [id];

    connection.query(sql,params,function(err,result){
        var isConnect = false;
        var resultCode = 404;
        var msg = '연결 실패';
        var hasFb = false;
        if (err){
            console.log(err);
        }
        else {
            msg = '연결 성공';
            isConnect = true;
            resultCode = 200;
            hasFb = result[0]['fb_id'];
            console.log("/user/hasFbId success")
            if (result[0]['fb_id'] != ""){
                msg = "파이어베이스 아이디 존재";
                hasFb = true;
            }
            else {
                msg = "파이어베이스 아이디 없음";
                hasFb = false;
            }
        }

        res.json({
            'isConnect' : isConnect,
            'resultCode' : resultCode,
            'msg': msg,
            'hasfb' : hasFb
        });

    }

    );
}
);


app.post('/user/join', function(req,res)
{
    var fbId = req.body.fb_id;
    var email = req.body.email;
    var nickname= req.body.nickname;
    var homeAddr = req.body.home_addr;
    var reportPoint = req.body.report_point;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var createdAt = req.body.created_at;
    

    var sql = 'insert into user (fb_id,email,nickname,home_addr,report_point,latitude,longitude,created_at) values (?,?,?,?,?,?,?,?)';
    var params = [fbId,email,nickname,homeAddr,reportPoint,latitude,longitude,createdAt];

    connection.query(sql,params,function(err,result)
    {   
        var isConnect = false;
        var resultCode=404;
        var msg = "에러 발생";
        if (err)
            console.log(err);
        else {
            console.log('/user/join success');
            resultCode = 200;
            isConnect = true;
            msg = result.insertId;
            
        }
        res.json({
            'isConnect' : isConnect,
            'resultCode' : resultCode,
            'msg': msg,
        });
    }
    );

}
);


app.post('/post/create', function(req,res)
{
    var title = req.body.title;
    var category_id = req.body.category_id;
    var user_id= req.body.user_id;
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
    var longitude = req.body.longitude
    var state = req.body.state;


    



    

    var sql = 'insert into post (title, category_id, user_id, content, type, main_addr, addr_detail, product_img, validate_type, validate_date, validate_img, created_at, latitude, longitude, state)  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var params = [title, category_id, user_id, content, type, main_addr, addr_detail, product_img, validate_type, validate_date, validate_img, created_at, latitude, longitude, state];

    connection.query(sql,params,function(err,result)
    {   
        var isConnect = false;
        var resultCode=404;
        var msg = "에러 발생";
        if (err)
            console.log(err);
        else {
            console.log('/post/create success');
            resultCode = 200;
            isConnect = true;
            msg = result.insertId;
        }
        res.json({
            'isConnect' : isConnect,
            'resultCode' : resultCode,
            'msg': msg,
        });
    }
    );

}
);

