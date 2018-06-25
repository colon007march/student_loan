import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany
} from "typeorm";
import {TokenMember} from "./TokenMember";
//import {Information} from "./Information";

@Entity()
export class Member {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nationalID:number

    @Column()
    password:string

    // @OneToOne(type => Information,information => information.user)
    // information:Information
    @OneToMany(type => TokenMember,tokenmember => tokenmember.member)
    tokenmember:TokenMember[]

    @Column()
    surname:string

    @Column()
    lastname:string

    @Column()
    email:string

    @Column()
    Birthdate:string

    @Column()
    tel:number

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}