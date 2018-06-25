import "reflect-metadata";
import {createConnection} from "typeorm";
import {Member} from "./entity/Member";
import TokenService from './services/TokenService'
import {TokenMember} from './entity/TokenMember'
var dateformat = require('dateformat')

let bodyParser = require("body-parser")
import {log} from "util"

let express = require("express")
let con = createConnection()
const app = express();
const port = 4000;
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Headers', 'accesstoken');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,accesstoken");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')

})
// TokenService.getTokenId().then(data => {
//     console.log('data',data)
// }).catch(err => {
//     console.log('err',err)
// })

app.post('/login', (req, res) => {
    con.then(async connection => {
        let memberRepo = connection.getRepository(Member)
        let findUser = await memberRepo.findOne({
            nationalID: req.body.nationalID,
            password: req.body.password
        })
        if (findUser === undefined) {
            res.status(400).json({
                statusName: 'wrong username or password'
            })
        } else {
            let accessToken = TokenService.getAccessToken()
            // let refreshToken = TokenService.getRefreshToken()
            let tokenmember = new TokenMember()
            tokenmember.token = accessToken,
                tokenmember.type = "accessToken",
                tokenmember.exprire = TokenService.getExpireAccessToken(),
                // tokenmember.tokenId =,
                // console.log(TokenService.getTokenId())
                tokenmember.member = await connection.getRepository(Member).findOne(findUser.id)
            await connection.getRepository(TokenMember).save(tokenmember)
            // let tokenmemberRF = new TokenMember()
            // tokenmemberRF.token = refreshToken
            // tokenmemberRF.type = "refreshToken"
            // tokenmemberRF.exprire = TokenService.getExpireRefreshToken()
            // // tokenmemberRF.tokenId = await TokenService.getTokenId()
            // // tokenmemberRF.tokenId = tokenmember.tokenId
            // tokenmemberRF.member = await connection.getRepository(Member).findOne(findUser.id)
            // await connection.getRepository(TokenMember).save(tokenmemberRF)
            res.status(200).json({
                statusName: 'login success',
                accesstoken: tokenmember.token
            })
        }
    })
})
app.post('/register', (req, res) => {
    con.then(async connection => {
        let member = new Member()
        member.nationalID = req.body.nationalID,
            member.password = req.body.password,
            member.surname = req.body.surname,
            member.lastname = req.body.lastname,
            // member.Birthdate=req.body.Birthdate,
            member.email = req.body.email,
            member.tel = req.body.tel
        await connection.getRepository(Member).save(member)
        res.status(200).json({
            statusName: 'register success',
        })
    })
})
app.get('/status', (req, res) => {
    con.then(async connection => {
        //console.log(req.headers.accesstoken)
        if (req.headers.accesstoken === undefined) {
            res.status(400).json({
                statusName: 'none accesstoken'
            })
        } else {
            let checktoken = await connection.getRepository(TokenMember).findOne({token: req.headers.accesstoken}, {relations: ['member']})
            if (checktoken === undefined || checktoken.exprire < new Date()) { //เช้ควันด้วย
                res.status(400).json({
                    statusName: 'wrong accesstoken'
                })
            } else {
                let memberinfo = connection.getRepository(Member)
                let findmember = await memberinfo.findOne(checktoken.member.id)
                res.status(200).json({
                    statusName: 'success',
                    nationalID: findmember.nationalID,
                    // refreshToken: refreshToken,
                    surname: findmember.surname,
                    lastname: findmember.lastname,
                    createddate:dateformat(findmember.createAt,"dddd,mmmm dS,yyyy"),
                    email: findmember.email,
                    tel: findmember.tel
                })
            }
        }
    })
})
app.get('/redirect', (req, res) => {
    con.then(async connection => {
        if (req.headers.accesstoken === undefined) {
            res.status(400).json({
                statusName: 'none accesstoken'
            })
        } else {
            let checktoken = await connection.getRepository(TokenMember).findOne({token: req.headers.accesstoken}, {relations: ['member']})
            if (checktoken === undefined || checktoken.exprire < new Date()) {
                res.status(400).json({
                    statusName: 'wrong accesstoken'
                })
            } else {
                let memberinfo = connection.getRepository(Member)
                let findmember = await memberinfo.findOne(checktoken.member.id)
                res.status(200).json({
                    statusName: 'success',
                })
            }
        }
    })
})
app.get('/logout', (req, res) => {
    con.then(async connection => {
        //console.log(req.headers.accesstoken)
        if(req.headers.accesstoken === undefined){
            res.status(400).json({
                statusName: 'none accesstoken'
            })
        }else{
        let tokenmember = await connection.getRepository(TokenMember).findOne({token: req.headers.accesstoken})
            if(tokenmember === undefined){
                res.status(400).json({
                    statusName: 'wrong accesstoken'
                })
            }else {}
        await connection.getRepository(TokenMember).remove(tokenmember)
        res.status(200).json({
            statusName: 'logout success',
        })}
    })
})
app.listen(4000, () => {
    console.log('Server running:' + port);
})