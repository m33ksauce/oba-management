import store from '../store';
import { Firestore } from 'firebase-admin/firestore';
import { ReleaseModel } from '../models/models';

class ReleaseService {
    private db: Firestore;

    constructor() {
        this.db = store.getFromFirestore();
    }

    insert(model: ReleaseModel) {
        this.db.collection("releases")
            .doc(model.Version)
            .set(model);

        this.db.collection("releases")
            .doc("latest")
            .set(model);
    }

    update(model: ReleaseModel) {
        this.db.collection("releases")
            .doc(model.Version)
            .update(model);
    }

    findAll(): Promise<ReleaseModel[]> {
        return this.db.collection("releases").get().then( docs => {
            if (docs == undefined || docs.empty) {
                console.log("Couldn't find any")
                return new Array<ReleaseModel>();
            }
            console.log(docs.size);
            return docs.docs.map(doc => doc.data()).map(this.docToDto);
        });
    }

    findOne(version: string): Promise<ReleaseModel | void> {
        return this.db.collection("releases")
                .doc(version)
                .get()
            .then( data => {
                var doc = data.data();
                if (doc == undefined) { return; }
                return this.docToDto(doc);
            });
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