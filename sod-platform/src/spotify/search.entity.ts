import { ItemTypes } from "@spotify/web-api-ts-sdk";
import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    //SearchEntity

    @Column()
    query: string;

    @Column()
    type: ItemTypes[];

    // @afterSearch()
    // logSearch(){
    //     console.log('Searching: ', this.query);
    // }
}