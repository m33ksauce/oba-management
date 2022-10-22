import { ReleaseModel } from "../models/models";
import { AttributeValue, DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput, ScanCommand, ScanCommandInput, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import S3Store from "../store/s3.store";
import { GetAppConfig } from "../config";

class ReleaseService {
    private db: DynamoDBClient;
    private tableName: string;

    constructor(s3Store: S3Store) {
        this.db = s3Store.getDynamoDbConnection();
        this.tableName = GetAppConfig().aws.dynamo.tableName;
    }

    public insert(model: ReleaseModel) {
        const versionParams: PutItemCommandInput = {
            TableName: this.tableName,
            Item: {
                VERSION: {S: model.Version},
                METADATA: {S: JSON.stringify(model)}
            },
        };

        const command = new PutItemCommand(versionParams);

        this.db.send(command);
    }

    async update(version: string, model: ReleaseModel) {
        const params: UpdateItemCommandInput = {
            TableName: this.tableName,
            Key: {
                VERSION: {S: version},
            },
            UpdateExpression: "set METADATA = :v",
            ExpressionAttributeValues: {
                ':v': {S: JSON.stringify(model)}
            }
        }

        const command = new UpdateItemCommand(params)

        this.db.send(command)
    }

    async findAll(): Promise<ReleaseModel[]> {
        const params: ScanCommandInput = {
            TableName: this.tableName,
        }

        let item = await this.db.send(new ScanCommand(params));

        if (!item.Items || item.Items.length == 0) return Promise.reject("Could not find a value");

        return item.Items.map(item => this.docToDto(item.METADATA));
    }

    async findOne(version: string): Promise<ReleaseModel | void> {
        console.log(this.tableName);
        const versionParams: GetItemCommandInput = {
            TableName: this.tableName,
            Key: {
                VERSION: {S: version}
            },
        }

        let item = await this.db.send(new GetItemCommand(versionParams));

        if (!item.Item?.METADATA) return Promise.reject("Could not find a value");

        return this.docToDto(item?.Item?.METADATA);
    }

    async delete(version: string) {
        const params: DeleteItemCommandInput = {
            TableName: this.tableName,
            Key: {
                VERSION: {S: version}
            }
        }

        this.db.send(new DeleteItemCommand(params))
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
