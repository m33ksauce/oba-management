import * as fs from 'firebase-admin';
import * as fsStore from 'firebase-admin/firestore';


const app = fs.initializeApp({
    databaseURL: "http://localhost:8080"
});

function getFromFirestore () {
    return fsStore.getFirestore(app);
}

function getStorage() {
    return fs.storage(app);
}

const store = { getFromFirestore, getStorage };

export default store;