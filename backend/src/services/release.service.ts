import store from "../store";
import { Firestore } from "firebase-admin/firestore";
import { ReleaseModel } from "../models/models";
import { AttributeValue, DynamoDBClient, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import S3Store from "../store/s3.store";

class ReleaseService {
    private db: Firestore;
    private db2: DynamoDBClient;

    constructor(s3Store: S3Store) {
        this.db = store.getFromFirestore()
        this.db2 = s3Store.getDynamoDbConnection();
    }

    insert(model: ReleaseModel) {
        const versionParams: PutItemCommandInput = {
            TableName: "releases",
            Item: {
                VERSION: {S: model.Version},
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
        return Promise.reject();
        // return this.db.collection("releases").get().then((docs) => {
        //     if (docs == undefined || docs.empty) {
        //         console.log("Couldn't find any");
        //         return new Array<ReleaseModel>();
        //     }
        //     console.log(docs.size);
        //     return docs.docs.map((doc) => doc.data()).map(this.docToDto);
        // });
    }

    async findOne(version: string): Promise<ReleaseModel | void> {

        const versionParams: GetItemCommandInput = {
            TableName: "releases",
            Key: {
                VERSION: {S: version}
            },
        }

        let item = await this.db2.send(new GetItemCommand(versionParams));

        if (!item.Item?.METADATA) return Promise.reject("Could not find a value");

        return this.docToDto(item?.Item?.METADATA);
    }


    private docToDto(av: AttributeValue): ReleaseModel {
        let docString = av.S;
        if (docString == undefined) throw new Error("Couldn't deserialize")
        let doc = JSON.parse(docString)

        return {
            Version: doc["Version"],
            Categories: doc["Categories"],
            Audio: doc["Audio"],
        };
    }
}

export default ReleaseService;
