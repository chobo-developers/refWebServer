import { createPool } from 'mysql';
import info from '../info.json' assert {type : "json"};

const pool = createPool({
    connectionLimit: 50,//최대 연결가능한 connetion수 설정 
    waitForConnections: true,
    host: info.host,
    user: info.user,
    database: info.database,
    password: info.password,
    port: info.port,
});
//pool에서 커넥션을 얻은 커넥션아이디 출력
pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
  });
  
//connetion을 끊으면 %d부분에 connetion id가 출력
pool.on('release', function (connection) {
console.log('Connection %d released', connection.threadId);
});

//사용 가능한 connetion이 존재하지 않으면 큐에 등록하고 순서를 대기
pool.on('enqueue', function () {
console.log('Waiting for available connection slot');
});
export const requestDB = async (sql, params) => {



    let response = {
        isConnect: false,
        resultCode: 404,
        msg: '연결 실패',
        result: null,
    };

    return new Promise((resolve, reject) => {
        
        //생성된 pool에서 connection을 가져온다.
        pool.getConnection(function(err,connection){
            if (err) throw err;
            connection.query(sql, params, (err, result) => {
                if (!err) {
                    resolve(
                        (response = {
                            isConnect: true,
                            resultCode: 200,
                            msg: '연결성공',
                            result: result,
                        })
                    );
                connection.release();   
                    
                } else {
                    reject(err);
                    connection.release(); 
                }});
            });
        });

    }
