import { getFirestore, getStorage } from "../util/firebase-app";
import * as fs from "fs";
import { lookup } from "mime-types";
import * as AWS from 'aws-sdk';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput} from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Category, Metadata, Publisher, AudioFile } from "../interfaces";
import { gzipSync } from "zlib";
import { NIL as uuidNIL } from 'uuid';
import axios from "axios";
import { prepFile } from "../util/fileUtils";

const https = require("http");


export class AwsPublisher implements Publisher {
    private dynamoDb: DynamoDBClient;
    private s3: S3Client;
    private httpEndpoint: string;
    private includeAudio: boolean;

    constructor(s3Endpoint: string,
        dynamoEndpoint: string,
        httpEndpoint: string,
        keyId: string, 
        key: string,
        region: string = "us-east-1",
        includeAudio = false,) 
    {
        AWS.config.update({
            region: region,
            httpOptions: {
                agent: new https.Agent({ rejectUnauthorized: false })
            }
        });

        const sharedConfig = {
            region: region,
            credentials: {
                accessKeyId: keyId,
                secretAccessKey: key,
            },
        }

        this.dynamoDb = new DynamoDBClient({ 
            endpoint: dynamoEndpoint,
            ...sharedConfig
        });

        this.s3 = new S3Client({
            apiVersion: "2006-03-01",
            endpoint: s3Endpoint,
            ...sharedConfig
        });

        this.httpEndpoint = httpEndpoint;
        this.includeAudio = includeAudio;
    }

    public PublishMetadata(translation: string, md: Metadata) {
        // Strip audio
        let strippedMd = this.stripAudioFromMd(md);
        const releaseCommand: PutItemCommand = new PutItemCommand({
            TableName: "app.oralbible.api.releases",
            Item: {
                VERSION: {S: `${translation}/${md.Version}`},
                METADATA: {S: compressString(JSON.stringify(strippedMd))}
            }
        })

        const audioCommand: PutItemCommand = new PutItemCommand({
            TableName: "app.oralbible.api.audio",
            Item: {
                VERSION: {S: `${translation}/${md.Version}`},
                AUDIO: {S: compressString(JSON.stringify(md.Audio))}
            }
        })

        this.dynamoDb.send(releaseCommand);
        this.dynamoDb.send(audioCommand)

        const releaseCommandLatest = new PutItemCommand({
            TableName: "app.oralbible.api.releases",
            Item: {
                VERSION: {S: `${translation}/latest`},
                METADATA: {S: compressString(JSON.stringify(strippedMd))}
            }
        });

        const audioCommandLatest: PutItemCommand = new PutItemCommand({
            TableName: "app.oralbible.api.audio",
            Item: {
                VERSION: {S: `${translation}/latest`},
                AUDIO: {S: compressString(JSON.stringify(md.Audio))}
            }
        })

        this.dynamoDb.send(releaseCommandLatest);
        this.dynamoDb.send(audioCommandLatest);        
    }

    public PublishCategories(translation: string, md: Metadata) {
        md.Categories.forEach(cat => {
            this.publishCats(translation, cat, md.Audio);
        })
    }

    private publishCats(translation: string, cat: Category, audio: AudioFile[], parent_id: string = "") {
        if (parent_id === "") parent_id = uuidNIL;
        this.postNewCategory(translation, cat.name, parent_id).then(newId => {
            cat.children.forEach(child => {
                console.log(isCategory(child))
                if (isCategory(child)) return this.publishCats(translation, child, audio, newId);
                if (this.includeAudio && !isCategory(child)) {
                    console.log("in here")
                    let audioFile = audio.find(aud => aud.id == child.audioTargetId);
                    console.log(audioFile)
                    if (audioFile == undefined) return
                    let [file, _] = prepFile(audioFile.file);
                    return this.postNewAudio(translation, child.name, newId, file)
                }
            })
        })
    }

    private postNewCategory(translation: string, name: string, parent_id: string): Promise<string> {
        return axios.post(`${this.httpEndpoint}/api/v1/${translation}/category`, {
            parent_id: parent_id,
            name: name
        }, { headers: { "Authorization": "Bearer th1s1sn0t0ken"}}).then((resp) => {
            if (resp.status == 200) return resp.data.result.id;
        })
    }

    private postNewAudio(translation: string, name: string, parent_id: string, file: Buffer) {
        let formData = new FormData();
        formData.append('name', name);
        formData.append('parent_id', parent_id);
        formData.append('file', new Blob([file]));
        return axios.post(`${this.httpEndpoint}/api/v1/${translation}/audio/single`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer th1s1sn0t0ken"
                }
            });
    }

    private stripAudioFromMd(md: Metadata): any {
        return {
            "Version": md.Version,
            "Categories": md.Categories
        }
    }

    public async PublishMedia(translation: string, id: string, mime: string, file: Buffer) {
        let bucket = "app.oralbible.api";
        let key = `${translation}/audio/${id}`;

        const putObjectCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file
        })

        return new Promise<void>((resolve, reject) => {
            this.s3
                .send(putObjectCommand)
                .then(() => resolve())
                .catch((err) => reject(err));
        })
    }
}

function isCategory(cat: any) {
        return cat.hasOwnProperty("children"); 
}

function compressString(raw: string): string {
    return gzipSync(raw).toString('base64')
}