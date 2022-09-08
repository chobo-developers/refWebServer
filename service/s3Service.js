//s3 import
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import info from '../info.json' assert {type : "json"};
//s3 config
AWS.config.update({
    accessKeyId: info.AWS_ACCESS_KEY_ID,
    secretAccessKey: info.AWS_SECRET_ACCESS_KEY,
    region: info.AWS_REGION,
});
const s3 = new AWS.S3();
//s3 upload
export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: info.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, uuidv4() + '.' + file.originalname.split('.').pop());
        },
    }),
});

//s3 delete
export const deleteFile = (key) => {
    const params = {
        Bucket: info.AWS_BUCKET_NAME,
        Key: key,
    };
    s3.deleteObject(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
}
//s3 download
export const downloadFile = (key) => {
    const params = {
        Bucket: info.AWS_BUCKET_NAME,
        Key: key,
    };
    s3.getObject(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
}
//s3 list
export const listFile = () => {
    const params = {
        Bucket: info.AWS_BUCKET_NAME,
    };
    s3.listObjects(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
}
