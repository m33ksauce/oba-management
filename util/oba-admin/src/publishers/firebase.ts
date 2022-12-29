import { getFirestore, getStorage } from "../util/firebase-app";
import * as fs from "fs";
import {lookup} from "mime-types";
import { Metadata } from "../interfaces";

export const FirebasePublisher = {
    PublishMetadata: (translation: string, md: Metadata) => {
        const db = getFirestore();

        db.collection("releases")
            .doc(md.Version)
            .set(md);
        
        db.collection("releases")
            .doc("latest")
            .set(md);
    },
    PublishMedia: async (translation: string, id: string, mime: string, file: Buffer) => {
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
    }
}