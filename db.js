const firebase = require('firebase');
const config = require('./Config');

const db = firebase.initializeApp(config.firebaseConfig);

module.exports = db ;

