import admin from "firebase-admin";

function firebaseApp() {
    return admin.initializeApp({
        credential: admin.credential.cert(process.env.FIREBASE!),
    });
}

export {firebaseApp};
