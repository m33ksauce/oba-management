import * as fs from 'firebase-admin';
import * as fsStore from 'firebase-admin/firestore';

const app = fs.initializeApp();

function getFromFirestore () {
    return fsStore.getFirestore(app);
}

const store = { getFromFirestore };

export default store;