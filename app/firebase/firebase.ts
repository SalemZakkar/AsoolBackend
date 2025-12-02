import admin from "firebase-admin";

let firebaseApp = admin.initializeApp({
    credential: admin.credential.cert("/etc/secrets/asool-key.json"),
});

export {firebaseApp};
