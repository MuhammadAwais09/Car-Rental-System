var admin = require("firebase-admin");

var serviceAccount = require("../config/firebase/car-rental-f0e79-firebase-adminsdk-i9wsa-5e230aecb2.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const pushNotifications = async (token:String, title:String, body:String) => {
    const message = {
        token,
        notification: {
            title,
            body,
        },
    };
    return admin.messaging().send(message)
        .then((response:any) => {
            console.log('Successfully sent notification:\n', response);
            const responses = {
                response,
                isError: false
            };
            return responses;
        })
        .catch((error:any) => {
            const response = {
                response:error,
                isError: true
            };
            return response;
         });
}

export default pushNotifications;