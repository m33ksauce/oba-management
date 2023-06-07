import { ReleaseModel } from "../models/models";
import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, PutItemCommandInput, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import AWSStore from "../store/s3.store";
import { GetAppConfig } from "../config";
import ILogger from "./ilogger.interface";
import zlib from "zlib";

class ReleaseService {
    private logger: ILogger;
    private db: DynamoDBClient;
    private releaseTable: string;
    private audioTable: string;

    constructor(s3Store: AWSStore, logger: ILogger) {
        this.logger = logger.WithFields({ "service": "ReleaseService" });
        this.db = s3Store.getDynamoDbConnection();
        this.releaseTable = GetAppConfig().aws.dynamo.releaseTableName;
        this.audioTable = GetAppConfig().aws.dynamo.audioTableName;
    }

    public insert(translation: string, model: ReleaseModel) {
        let audio = model.Audio;
        let modelWithoutAudio = { Version: model.Version, Categories: model.Categories }
        let versionKey: string = `${translation}/${model.Version}`;

        const releaseParams: PutItemCommandInput = {
            TableName: this.releaseTable,
            Item: {
                VERSION: { S: versionKey },
                METADATA: { S: this.compressString(JSON.stringify(modelWithoutAudio)) }
            },
        };

        const audioParams: PutItemCommandInput = {
            TableName: this.audioTable,
            Item: {
                VERSION: { S: versionKey },
                AUDIO: { S: this.compressString(JSON.stringify(audio)) }
            }
        }

        try {
            this.logger.WithFields({ 'modelVersion': model.Version })
                .Info("Inserting release");
            this.db.send(new PutItemCommand(releaseParams));
            this.db.send(new PutItemCommand(audioParams))
        }
        catch (err: any) {
            this.logger.WithFields({ 'modelVersion': model.Version })
                .Error("exception", err.message);
        }
    }

    async update(translation: string, version: string, model: ReleaseModel) {
        let audio = model.Audio;
        let modelWithoutAudio = { Version: model.Version, Categories: model.Categories }
        let versionKey: string = `${translation}/${model.Version}`;

        const releaseCommand = new UpdateItemCommand({
            TableName: this.releaseTable,
            Key: {
                VERSION: { S: versionKey },
            },
            UpdateExpression: "set METADATA = :v",
            ExpressionAttributeValues: {
                ':v': { S: this.compressString(JSON.stringify(modelWithoutAudio)) }
            }
        });

        const audioCommand = new UpdateItemCommand({
            TableName: this.audioTable,
            Key: {
                VERSION: { S: versionKey },
            },
            UpdateExpression: "set METADATA = :v",
            ExpressionAttributeValues: {
                ':v': { S: this.compressString(JSON.stringify(audio)) }
            }
        })

        try {
            this.logger.WithFields({ 'modelVersion': version })
                .Info("Updating release");
            this.db.send(releaseCommand);
            this.db.send(audioCommand);
        }
        catch (err: any) {
            this.logger.WithFields({ 'modelVersion': version })
                .Error("exception", err.message);
        }
    }

    // async findAll(translation: string): Promise<ReleaseModel[]> {
    //     const params: ScanCommandInput = {
    //         TableName: this.releaseTable,
    //     }

    //     try {
    //         this.logger.Info("Fetching all versions");
    //         let item = await this.db.send(new ScanCommand(params));

    //         if (!item.Items || item.Items.length == 0) return Promise.reject("Could not find a value");

    //         return item.Items.map(item => this.docToDto(item.METADATA));
    //     }
    //     catch (err: any) {
    //         this.logger.Error("exception", err.message);
    //         return Promise.reject();
    //     }
    // }

    async findOne(translation: string, version: string): Promise<ReleaseModel | void> {
        let versionKey: string = `${translation}/${version}`;
        const releaseCommand: GetItemCommand = new GetItemCommand({
            TableName: this.releaseTable,
            Key: {
                VERSION: { S: versionKey }
            },
        });

        const audioCommand: GetItemCommand = new GetItemCommand({
            TableName: this.audioTable,
            Key: {
                VERSION: { S: versionKey }
            },
        });

        try {
            this.logger.WithFields({ 'modelVersion': version })
                .Info("Finding release");
            let mdItem = await this.db.send(releaseCommand);
            let audioItem = await this.db.send(audioCommand);

            if (!mdItem.Item?.METADATA) return Promise.reject("Could not find a value");
            if (!audioItem.Item?.AUDIO) return Promise.reject("Could not find a value");

            return this.docToDto(mdItem?.Item?.METADATA, audioItem?.Item?.AUDIO);
        }
        catch (err: any) {
            this.logger.WithFields({ 'modelVersion': version })
                .Error("exception", err.message);
            return Promise.reject();
        }


    }

    async delete(translation: string, version: string) {
        let versionKey: string = `${translation}/${version}`;
        const releaseCommand: DeleteItemCommand = new DeleteItemCommand({
            TableName: this.releaseTable,
            Key: {
                VERSION: { S: versionKey }
            }
        })

        const audioCommand: DeleteItemCommand = new DeleteItemCommand({
            TableName: this.audioTable,
            Key: {
                VERSION: { S: versionKey }
            }
        })

        try {
            this.logger.WithFields({ 'modelVersion': version })
                .Info("Deleting release");
            await this.db.send(releaseCommand)
            await this.db.send(audioCommand)
        }
        catch (err: any) {
            this.logger.WithFields({ 'modelVersion': version })
                .Error("exception", err.message);
        }
    }

    private docToDto(mdAV: AttributeValue, audioAV: AttributeValue): ReleaseModel {
        if (mdAV.S == undefined) throw new Error("Couldn't deserialize");
        if (audioAV.S == undefined) throw new Error("Couldn't deserialize");
        let mdDoc = JSON.parse(this.decompressString(mdAV.S));
        let audioDoc = JSON.parse(this.decompressString(audioAV.S));

        console.log(mdDoc);

        return {
            Version: mdDoc["Version"],
            Categories: mdDoc["Categories"],
            Audio: audioDoc,
        };
    }

    private compressString(raw: string): string {
        return zlib.gzipSync(raw).toString('base64')
    }

    private decompressString(encoded: string): string {
        let buf = Buffer.from(encoded, 'base64');
        return zlib.gunzipSync(buf).toString();
    }
}

export default ReleaseService;
