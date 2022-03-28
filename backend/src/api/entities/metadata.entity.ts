import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { AudioFileMetadata } from "./audio-file.entity";

interface AudioItem {
    id: string;
    file: string;
}

@Entity()
export class Metadata {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    projectID: string;

    @Column()
    isRelease: boolean;

    @Column()
    version: string;

    @Column()
    categories: object[];

    @Column()
    audio: AudioItem[];
}