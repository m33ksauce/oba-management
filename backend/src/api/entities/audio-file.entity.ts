import { buffer } from "stream/consumers";
import { Binary, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class AudioFileEntity {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    projectID: ObjectID;

    @Column()
    metadata: AudioFileMetadata;

    @Column(type => buffer)
    file: Buffer;
}

export class AudioFileMetadata {

}