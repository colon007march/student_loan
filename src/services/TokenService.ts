import * as jwt from 'jsonwebtoken'
import { TokenMember } from "../entity/TokenMember";
import { createConnection } from "typeorm";
let connect = createConnection()
let tokenService = {
    getRefreshToken:() => {
        return jwt.sign({}, 'f54ds65f4d4f8d8ef48e', { expiresIn: '1h' });},
    getAccessToken:() => {
            return jwt.sign({}, 'vcvccbrgrdggwr', { expiresIn: '20h' });},
    getExpireRefreshToken: () => {
        return new Date(new Date().setDate(new Date().getDate() + 30))
    },
    getExpireAccessToken: () => {
        return new Date(new Date().setDate(new Date().getDate() + 1))
    },
    // getTokenId: () => {
    //     return new Promise((resolve,reject) =>{
    //         connect.then(async connection => {
    //             let tokens = await connection
    //                 .getRepository(TokenMember)
    //                 .createQueryBuilder("token")
    //                 .orderBy("token.tokenId", "DESC")
    //                 // .take(10)
    //                 .getMany();
    //             if(tokens.length > 0){
    //                 resolve(tokens[0].tokenId + 1)
    //             }else{
    //                 resolve(1)
    //             }
    //
    //         }).catch(err => {
    //             console.log(err)
    //         })
    //     })
    // }
}
export default tokenService



