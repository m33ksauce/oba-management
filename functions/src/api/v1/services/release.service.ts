import store from '../../../store';
import { Firestore } from 'firebase-admin/firestore';
import { ReleaseModel } from '../models/models';

class ReleaseService {
    private db: Firestore;

    constructor() {
        this.db = store.getFromFirestore();
    }

    findOne(version: string): Promise<ReleaseModel> {
        return new Promise((resolve, reject) => {
            if (version == "latest") {
                this.db.collection("releases")
                    .limit(1)
                    .select()
                    .get()
                .then( data => {
                    var doc = data.docs.shift();
                    resolve({
                        Version: doc?.data()["Version"],
                        Categories: doc?.data()["Categories"],
                        Audio: doc?.data()["Audio"]
                    });
                });
            }
        })
    }
}

export default ReleaseService;