
admin.initializeApp({
    credential : admin.credential.cert(serviceAccount)
});

const registrationToken = '';

const message = {
    data :{
        title: '제목',
        body: '내용',
    },
    toekn : registrationToken
};

admin.messaging().send(message).
    then((response)=>
    {
        consolg.log('successfully sent message: ',response) ;
    })
    .catch((error)=>{
        console.log('error sending message: ',error);
    })