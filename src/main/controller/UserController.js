const Database = require("../config/Database")
const Mailgun = require("../config/Mailgun")
const Auth = require("../config/Auth")
const UserService = require("../service/UserService")
const HttpMethod = require("../types/HttpMethod")
// const { FindUsersRequest } = require("../dto/FindUsersRequest")
const { CreateUserDto } = require("../dto/user/CreateUserDto")
const { LoginUserDto } = require("../dto/user/LoginUserDto")
const ChangeUserAuthCodeDto = require("../dto/user/ChangeUserAuthCodeDto")
const ResetUserPasswordDto = require("../dto/user/ResetUserPasswordDto")
const ChangeUserPasswordDto = require("../dao/ChangeUserPasswordDto")
const DeleteUserDto = require("../dto/user/DeleteUserDto")

// 회원가입 >> ㅇㅇ
// 정식회원 변경 >> ㅇㅇ
// 로그인 >> ㅇㅇ
// 비밀번호 초기화 >> ㅇㅇ
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

    //회원가입
    createUser: {
        method: HttpMethod.POST,
        path: "/users",
        handler: async (req, res, next) => {
            const request = new CreateUserDto(req)
            const { email } = request

            const connection = await Database.getConnection(res) //Bind parameters must be array if namedPlaceholders parameter is not enabled
            const authCode = await UserService.createUserConnection(connection, request)

            //send authCode email
            await Mailgun.sendAuthCode(email, authCode)
            res.output = { result: true }
            next()
        },
    },

    //정식회원 변경
    changeAuthByUser: {
        method: HttpMethod.POST,
        path: "/auths/:authcode",
        handler: async (req, res, next) => {
            const request = new ChangeUserAuthCodeDto(req)

            const connection = await Database.getConnection(res)
            await UserService.changeAuthConnection(connection, request)

            res.output = { result: true }
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

            let formalMember = true
            let admin = true
            if (result.permission !== 1) {
                formalMember = false
            }
            if (result.permission !== 2) {
                admin = false
            }

            res.output = {
                result: { Token: Auth.signToken(result.id, result.permission) },
                ...{ formalMember: formalMember, admin: admin },
            }
            next()
        },
    },

    //비밀번호 초기화
    resetPasswordByUser: {
        method: HttpMethod.POST,
        path: "/reset-password",
        handler: async (req, res, next) => {
            const request = new ResetUserPasswordDto(req)
            const { email } = request
            //메일건으로 보내지기 이전에 존재하는 사용자인지는 미들웨어 (토큰)에서 판명남 코드 늘리기 ㄴㄴ

            const changedPassword = await Mailgun.resetPassword(email)

            const connection = await Database.getConnection(res)
            await UserService.resetUserPassword(connection, email, changedPassword)

            res.output = { result: true }
            next()
        },
    },
    //비밀번호 변경 >>>>>>>>> 얘 지금 문제인데, 진짜 모르겠음 오타도 아님 "connection.execute is not a function"
    changePasswordByUser: {
        method: HttpMethod.PUT,
        path: "/users/:userId",
        handler: async (req, res, next) => {
            const request = new ChangeUserPasswordDto(req)
            const { password, changePw, userId } = request

            const connection = await Database.getConnection(res)
            await UserService.changeUserPasswordConnection(connection, password, changePw, userId)

            res.output = { result: true }
            next()
        },
    },
    // 회원탈퇴 >>>>>>>>> 니도 왜 문제야 나 이러면 화나서 그냥 엎고 처음부터 다시 만들거야 ..진심이야 ..
    deleteUser: {
        method: HttpMethod.DELETE,
        path: "/users/:userId",
        handler: async (req, res, next) => {
            const request = new DeleteUserDto(req)

            const connection = await Database.getConnection(res)
            await UserService.deleteUserConnection(connection, request)

            res.output = { result: true }
            next()
        },
    },
}
// }
