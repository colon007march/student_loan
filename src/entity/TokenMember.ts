import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,ManyToOne
} from "typeorm";
import {Member} from "./Member";
//import {Information} from "./Information";

@Entity()
export class TokenMember {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    token:string

    @Column()
    type:string

     // @Column()
     // tokenId:number

    @Column()
    exprire:Date

    @ManyToOne(type => Member,member => member.tokenmember)
    member:Member

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}