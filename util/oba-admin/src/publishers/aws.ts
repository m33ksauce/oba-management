import { getFirestore, getStorage } from "../util/firebase-app";
import * as fs from "fs";
import {lookup} from "mime-types";
import { Metadata } from "../interfaces";

export const AwsPublisher = {
    PublishMetadata: (md: Metadata) => {
        console.log("Not implemented!")
    },
    PublishMedia: async (id: string, mime: string, file: Buffer) => {
        console.log("Not implemented!")
    }
}