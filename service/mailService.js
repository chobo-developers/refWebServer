import * as nodemailer from 'nodemailer';
import smtpTransporter from 'nodemailer-smtp-transport';
import info from '../info.json' assert {type : "json"};

export const sendEmail = async (id, postId,content) => {

    // const transporter = nodemailer.createTransport({
    //     service: `gmail`,
    //     port: 465, //smtp 포트 이용
    //     secure: true, // true for 465, false for other ports
    //     auth: { 
    //         user: info.gmail,
    //         pass: info.mailpassword,
    //     },
    // });
    let response = {
        isConnect: false,
        resultCode: 404,
        msg: '연결 실패',
        result: null,
    };

    var transporter = nodemailer.createTransport(smtpTransporter({
        service: 'Naver',
        host: 'smtp.naver.com',
        auth: {
            user: info.mail,     //보내는 분의 메일계정
            pass: info.mailpassword
        }
    }));

    const emailOptions = { // 옵션값 설정
        from: info.mail,
        to: info.mail,
        subject: "user id: " + id + `로 부터 신고 접수\n`,
        html: "post id:" + postId + '\n' +content
    };

    // 전송
    // 고려사항 : promise 객체 사용해서 async 빼고 then, catch 로 사용할 수 있지 않을까?
    return new Promise((resolve, reject) => {
        transporter.sendMail(emailOptions, (err, res) => {
            if (err) {
                console.log(`failed... => `, err);
                reject(response);
            } else {
                console.log(`succeed... => `, res);
                resolve(response = {
                    isConnect: true,
                    resultCode: 200,
                    msg: '전송완료',
                    result: 1
                });
                
            }
            transporter.close();
        });
});
}