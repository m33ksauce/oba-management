import {getFirestore} from "../util/firebase-app";

export interface Metadata {
    Version: string,
    Categories: unknown[],
    Audio: AudioFile[]
}

interface AudioFile {
    file: string,
    id: string
}

export const MetadataPublisher = {
    Publish: (md: Metadata) => {
        const db = getFirestore();

        db.collection("releases")
            .doc(md.Version)
            .set(md);
        
        db.collection("releases")
            .doc("latest")
            .set(md);
    }
}