import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

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
}