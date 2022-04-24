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
            this.db.collection("releases")
                .doc(version)
                .get()
            .then( data => {
                var doc = data.data();
                if (doc == undefined) { return reject("couldn't find the doc"); }
                resolve(this.docToDto(doc));
            });
        })
    }


    private docToDto(doc: FirebaseFirestore.DocumentData): ReleaseModel {
        return {
            Version: doc["Version"],
            Categories: doc["Categories"],
            Audio: doc["Audio"]
        }
    }
}

export default ReleaseService;