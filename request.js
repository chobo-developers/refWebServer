import { createConnection } from 'mysql';
import info from './info.json' assert {type : "json"};



export const requestDB = async (sql, params) => {

    const connection = createConnection({
        host: info.host,
        user: info.user,
        database: info.database,
        password: info.password,
        port: info.port,
    });

    let response = {
        isConnect: false,
        resultCode: 404,
        msg: '연결 실패',
        result: null,
    };

    await connection.query(sql, params, (err, result) => {
        if (!err) {
            response = {
                isConnect: true,
                resultCode: 200,
                msg: '연결성공',
                result: result,
                
            };
            console.log('연결 성공');
            
        }
    });

    return response;
};
