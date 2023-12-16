import AWSStore from "../store/s3.store";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { GetAppConfig } from "../config";
import { LoggerService } from "./logger.service";
import ILogger from "./ilogger.interface";
import { SqlStore } from "../store/sql.store";
import { CreateAudioResultDTO, UpdateAudioResultDTO } from "../dto/dto";
import { UpdateAudioResultDTOMappers } from "../mappers/category.mappers";
import { AudioFileModel } from "../models/audio.model";

class AudioService {
  private logger: ILogger;
  private s3client: S3Client;
  private bucket: string;
  private sqlStore: SqlStore;

  constructor(store: AWSStore, logger: LoggerService, sqlStore: SqlStore) {
    this.logger = logger.WithFields({ service: "AudioService" });
    this.s3client = store.getS3Connection();
    this.bucket = GetAppConfig().aws.s3.defaultBucket;
    this.sqlStore = sqlStore;
  }

  findOne(translation: string, fileId: string): Promise<ArrayBuffer> {
    let key = `${translation}/audio/${fileId}`;

    let log = this.logger.WithFields({ FileKey: key });

    log.Info(`Fetching file`);

    return new Promise(async (resolve, reject) => {
      const params: GetObjectCommandInput = {
        Bucket: this.bucket,
        Key: key,
      };

      const getObjectCommand = new GetObjectCommand(params);

      try {
        const response = await this.s3client.send(getObjectCommand);

        if (!response.Body) return reject("Could not talk to S3");

        let body = response.Body as Readable;

        const chunks: Uint8Array[] = [];

        body.on("data", (chunk) => chunks.push(chunk));
        body.on("error", (e) => {
          log.Error(e.name, e.message);
          reject();
        });
        body.on("end", () => resolve(Buffer.concat(chunks)));
      } catch (err: any) {
        log.Error("exception", err.message);
        reject({ msg: "Something went wrong" });
      }
    });
  }

  async findByParent(parentId: string): Promise<AudioFileModel[]> {
    let client = await this.sqlStore.GetPool().connect();

    const readQuery = `SELECT * from oba_admin.audio
      WHERE category_id=$1`;

    try {
      let results = await client.query(readQuery, [parentId]);
      
      return results.rows.map(row => {
        return {
          id: row.id,
          bucket_path: row.bucket_path,
          name: row.name,
          parentId: row.category_id,
        }
      });
    } catch (e: any) {
      this.logger.Error("exception", e.message);
      throw e;
    } finally {
      client.release();
    }
  }

  async create(translation: string, 
    fileId: string,
    name: string,
    parentId: string,
    buff: Buffer): Promise<CreateAudioResultDTO> {
      
    let key = `${translation}/audio/${fileId}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buff,
    });

    let client = await this.sqlStore.GetPool().connect();
    const insertQuery = `INSERT INTO oba_admin.audio(id, bucket_path, name, category_id)
                        VALUES ($1, $2, $3, $4::UUID);`

    const params = [fileId, `${this.bucket}/${key}`, name, parentId]

    console.log(params);

    try {
      await this.s3client.send(putObjectCommand);
      let result = await client.query(insertQuery, params);
      console.log(result.rows);

      return {
        id: fileId
      }
    } catch (e: any) {
      console.log(e);
      throw 500;
    } finally {
      client.release();
    }
  }

  async update(translation: string,
    fileId: string,
    name: string,
    parentId: string): Promise<UpdateAudioResultDTO> {
      let client = await this.sqlStore.GetPool().connect();

      const updateStub = `UPDATE oba_admin.audio SET `

      let updateIndex = 0;

      let nameUpdate = (name == undefined ||name == "")
        ? "" : `name=$${++updateIndex}`;
      let parentUpdate = (parentId == undefined || parentId == "")
        ? "" : `category_id = $${++updateIndex}::UUID`;
      const whereStub = ` WHERE id=$${++updateIndex}`

      let params = [];
      if (name != undefined && name != "") params.push(name);
      if (parentId != undefined && parentId != "") params.push(parentId);

      params.push(fileId);

      if (nameUpdate != "" && parentUpdate != "") nameUpdate += ", "

      const query = updateStub
        + nameUpdate
        + parentUpdate
        + whereStub;

      const selectQuery = "SELECT * FROM oba_admin.audio WHERE id=$1;";

      try {
        await client.query(query, params);
        let result = await client.query(selectQuery, [fileId]);
        return UpdateAudioResultDTOMappers.FromDB(result.rows.shift());
      } catch (e: any) {
        console.log(e);
        throw 500;
      } finally {
        client.release();
      }
    }
}

export default AudioService;
