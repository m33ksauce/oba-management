import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Metadata } from "./metadata.entity";

@Entity()
export class Release {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    projectID: string;

    @Column()
    version: string;
    
    @Column()
    metadata: Metadata;
}