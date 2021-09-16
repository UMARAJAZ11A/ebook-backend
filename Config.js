const {
    GCLOUD_PROJECT_ID ,
    GCLOUD_APPLICATION_CREDENTIALS ,
    GCLOUD_STORAGE_BUCKET_URL ,

    //firebase config
    API_KEY ,
    AUTH_DOMAIN ,
    PROJECT_ID ,
    STORAGE_BUCKET ,
    MESSAGING_SENDER_ID,
    APP_ID ,
    MEASUREMENT_ID ,
} = process.env

module.exports = {
    firebaseConfig = {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
        measurementId: MEASUREMENT_ID
      }
}