import { ReleaseModel } from "../models/models";
import { AttributeValue, DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput, ScanCommand, ScanCommandInput, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import S3Store from "../store/s3.store";
import { GetAppConfig } from "../config";
import ILogger from "./ilogger.interface";

class ReleaseService {
    private logger: ILogger;
    private db: DynamoDBClient;
    private tableName: string;

    constructor(s3Store: S3Store, logger: ILogger) {
        this.logger = logger.WithFields({"service": "ReleaseService"});
        this.db = s3Store.getDynamoDbConnection();
        this.tableName = GetAppConfig().aws.dynamo.tableName;
    }

    public insert(translation: string, model: ReleaseModel) {
        let versionKey: string = `${translation}/${model.Version}`;
        const versionParams: PutItemCommandInput = {
            TableName: this.tableName,
            Item: {
                VERSION: {S: versionKey},
                METADATA: {S: JSON.stringify(model)}
            },
        };
        
        const command = new PutItemCommand(versionParams);
        
        try {
            this.logger.WithFields({'modelVersion': model.Version})
                .Info("Inserting release");
            this.db.send(command);
        }
        catch (err: any) {
            this.logger.WithFields({'modelVersion': model.Version})
                .Error("exception", err.message);
        }
    }

    async update(translation: string, version: string, model: ReleaseModel) {
        let versionKey: string = `${translation}/${model.Version}`;
        const params: UpdateItemCommandInput = {
            TableName: this.tableName,
            Key: {
                VERSION: {S: versionKey},
            },
            UpdateExpression: "set METADATA = :v",
            ExpressionAttributeValues: {
                ':v': {S: JSON.stringify(model)}
            }
        }

        const command = new UpdateItemCommand(params)

        try {
            this.logger.WithFields({'modelVersion': version})
                .Info("Updating release");
            this.db.send(command);
        }
        catch (err: any) {
            this.logger.WithFields({'modelVersion': version})
                .Error("exception", err.message);
        }
    }

    async findAll(translation: string): Promise<ReleaseModel[]> {
        const params: ScanCommandInput = {
            TableName: this.tableName,
        }

        try {
            this.logger.Info("Fetching all versions");
            let item = await this.db.send(new ScanCommand(params));
    
            if (!item.Items || item.Items.length == 0) return Promise.reject("Could not find a value");
    
            return item.Items.map(item => this.docToDto(item.METADATA));
        }
        catch (err: any) {
            this.logger.Error("exception", err.message);
            return Promise.reject();
        }
    }

    async findOne(translation: string, version: string): Promise<ReleaseModel | void> {
        let versionKey: string = `${translation}/${version}`;
        const versionParams: GetItemCommandInput = {
            TableName: this.tableName,
            Key: {
                VERSION: {S: versionKey}
            },
        }

        try {
            this.logger.WithFields({'modelVersion': version})
                .Info("Finding release");
            let item = await this.db.send(new GetItemCommand(versionParams));
    
            if (!item.Item?.METADATA) return Promise.reject("Could not find a value");
    
            return this.docToDto(item?.Item?.METADATA);
        }
        catch (err: any) {
            this.logger.WithFields({'modelVersion': version})
                .Error("exception", err.message);
            return Promise.reject();
        }
        

    }

    async delete(translation: string, version: string) {
        let versionKey: string = `${translation}/${version}`;
        const params: DeleteItemCommandInput = {
            TableName: this.tableName,
            Key: {
                VERSION: {S: versionKey}
            }
        }

        try {
            this.logger.WithFields({'modelVersion': version})
                .Info("Deleting release");
            await this.db.send(new DeleteItemCommand(params))
        }
        catch (err: any) {
            this.logger.WithFields({'modelVersion': version})
                .Error("exception", err.message);
        }
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
