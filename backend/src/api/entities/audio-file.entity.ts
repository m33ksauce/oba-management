import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

export class AudioFileMetadata {
    fileName: string;
}

@Entity()
export class AudioFile {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    projectID: string;

    @Column()
    metadata: AudioFileMetadata;

    @Column()
    file: Buffer;
}