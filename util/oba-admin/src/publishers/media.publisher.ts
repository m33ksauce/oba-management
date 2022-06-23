import { getStorage } from "../util/firebase-app";
import { Blob } from "buffer";
import * as fs from "fs";
import {lookup} from "mime-types";

export const MediaPublisher = {
    Publish: async (id: string, mime: string, file: Buffer) => {
        const bucket = getStorage().bucket("oralbibleapp");

        const stream = bucket.file(`audio/${id}`)
            .createWriteStream({
                metadata: {
                    contentType: mime
                }
            });

        return new Promise<void>(async (resolve, reject) => {
            stream.on("finish", () => {
                resolve();
            });

            stream.on("error", (err) => {
                reject(err);
            });

            stream.end(file);
        });
    },
    PrepFile: (path: string): [Buffer, string] => {
        return [
            fs.readFileSync(path),
            lookup(path) || "audio/mpeg3"
        ]
    }
}