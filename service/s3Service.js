//s3 import
import AWS from 'aws-sdk';
import info from '../info.json' assert {type : "json"};
//s3 config
AWS.config.update({
    accessKeyId: info.AWS_ACCESS_KEY_ID,
    secretAccessKey: info.AWS_SECRET_ACCESS_KEY,
    region: info.AWS_REGION,
});
const s3 = new AWS.S3();

export const uploadImage = async (data) => {
    const params = {
      Bucket: info.AWS_BUCKET_NAME,
    }
    
    if (info.AWS_ACCESS_KEY_ID) params.Key = bucketKey
    // if (fileName) params.Key = fileName
    // if (bucketKey && fileName) params.Key = `${bucketKey}${fileName}`
    if (data) params.Body = Buffer.from(data)
    
    return await s3
      .upload(params)
      .promise()
}

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
