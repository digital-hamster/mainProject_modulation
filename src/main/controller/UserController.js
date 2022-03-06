

const Database = require("../config/Database")
const Mailgun = require("../config/Mailgun")
const Auth = require("../config/Auth")
// const { FindUsersRequest } = require("../dto/FindUsersRequest")
const { CreateUserDto } = require("../dto/user/CreateUserDto")
const { LoginUserDto } = require("../dto/user/LoginUserDto")
const UserService = require("../service/UserService")
const HttpMethod = require("../types/HttpMethod")


// 회원가입
// 정식회원 변경
// 로그인 >> ㅇㅇ
// 비밀번호 초기화
// 비밀번호 변경
// 회원탈퇴
module.exports = {
    //유저 정보 조회 api*
    selectUserExample: {
        method: HttpMethod.GET,
        path: "/users",
        handler: async (req, res, next) => {
            const connection = await Database.getConnection(res)
            res.output = await UserService.selectUserExample(connection)
            next()
        },
    },
    //document limit, offset, req.query
    // FindUsersExample: {
    //     method: HttpMethod.GET,
    //     path: "/users",
    //     handler: async (req, res, next) => {
    //         const request = new FindUsersRequest(req)
    //         const connection = await Database.getConnection(res)
    //         res.output = await UserService.findUserExample(connection, request) //얘는 db connection
    //         next()
    //     },

    // 회원가입
    createUser: {
        method: HttpMethod.POST,
        path: "/users",
        handler: async (req, res, next) => {
            const request = new CreateUserDto(req)
            const { email } = request

            const connection = await Database.getConnection(res)
            await UserService.createUserConnection(connection, request)
            await UserService.createAuthCode(connection)
            //send authCode email
            await Mailgun.sendAuthCode(email, authCode)
            // res.output =
            next()
        },
    },

    //로그인
    loginUser: {
        method: HttpMethod.POST,
        path: "/login",
        handler: async (req, res, next) => {
            const request = new LoginUserDto(req)

            const connection = await Database.getConnection(res)
            const result = await UserService.loginUserConnection(connection, request) //dao의 return userInfrom을 result 결과로 담은거임 !!!

            //res.output = await UserService.loginUserConnection(connection, request)
            // res.output = { result : true}

            let formalMember = true
            let admin = true
            if (result.permission !== 1) {
                formalMember = false
            }
            if (result.permission !== 2) {
                admin = false
            }

            res.output = { result : { Token: Auth.signToken(result.id, result.permission) }, ...{formalMember: formalMember, admin: admin} }
            next()
        },
    },
}
// }
