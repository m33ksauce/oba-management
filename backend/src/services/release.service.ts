import store from "../store";
import { Firestore } from "firebase-admin/firestore";
import { ReleaseModel } from "../models/models";
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import S3Store from "../store/s3.store";
import { randomUUID } from "crypto";

class ReleaseService {
    private db: Firestore;
    private db2: DynamoDBClient;

    constructor(s3Store: S3Store) {
        this.db = store.getFromFirestore()
        this.db2 = s3Store.getDynamoDbConnection();
    }

    insert(model: ReleaseModel) {
        // this.db.collection("releases")
        //     .doc(model.Version)
        //     .set(model);

        // this.db.collection("releases")
        //     .doc("latest")
        //     .set(model);

        const versionParams: PutItemCommandInput = {
            TableName: "releases",
            Item: {
                VERSION: {S: randomUUID()},
                METADATA: {S: JSON.stringify(model)}
            },
        };

        const command = new PutItemCommand(versionParams);

        this.db2.send(command)
    }

    update(model: ReleaseModel) {
        this.db.collection("releases")
            .doc(model.Version)
            .update(model);
    }

    findAll(): Promise<ReleaseModel[]> {
        return this.db.collection("releases").get().then((docs) => {
            if (docs == undefined || docs.empty) {
                console.log("Couldn't find any");
                return new Array<ReleaseModel>();
            }
            console.log(docs.size);
            return docs.docs.map((doc) => doc.data()).map(this.docToDto);
        });
    }

    findOne(version: string): Promise<ReleaseModel | void> {
        return this.db.collection("releases")
            .doc(version)
            .get()
            .then((data) => {
                const doc = data.data();
                if (doc == undefined) return;
                return this.docToDto(doc);
            });
    }


    private docToDto(doc: FirebaseFirestore.DocumentData): ReleaseModel {
        return {
            Version: doc["Version"],
            Categories: doc["Categories"],
            Audio: doc["Audio"],
        };
    }
}

export default ReleaseService;
