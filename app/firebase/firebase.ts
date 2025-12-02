import admin from "firebase-admin";

let firebaseApp = admin.initializeApp({
    credential: admin.credential.cert("./asool-key.json"),
});

export {firebaseApp};
