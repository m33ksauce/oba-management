import { Binary, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";


@Entity()
export class MediaBlob {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    projectName: string;

    @Column()
    version: string;

    @Column(type => Binary)
    media: Binary;
}