import nodemailer from 'nodemailer';
import info from './info.json' assert {type : "json"};

export const sendEmail = async (id, content) => {
    const transporter = nodemailer.createTransport({
        service: `gmail`,
        port: 465, //smtp 포트 이용
        secure: true, // true for 465, false for other ports
        auth: { 
            user: info.gmail,
            pass: info.password,
        },
    });
    const emailOptions = { // 옵션값 설정
        from: info.gmail,
        to: info.gmail,
        subject: "user id: " + id + `로 부터 신고 접수`,
        html: content,
    };

    // 전송
    // 고려사항 : promise 객체 사용해서 async 빼고 then, catch 로 사용할 수 있지 않을까?
    return new Promise((resolve, reject) => {
        transporter.sendMail(emailOptions, (err, res) => {
            if (err) {
                console.log(`failed... => `, err);
                reject(err);
            } else {
                console.log(`succeed... => `, res);
                resolve(res);
            }
            transporter.close();
        });
});
}