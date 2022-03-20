const Database = require("../config/Database")
const Mailgun = require("../config/Mailgun")
const Auth = require("../config/Auth")
const UserService = require("../service/UserService")
const HttpMethod = require("../types/HttpMethod")
const { CreateUserDto } = require("../dto/user/CreateUserDto")
const { LoginUserDto } = require("../dto/user/LoginUserDto")
const ChangeUserAuthCodeDto = require("../dto/user/ChangeUserAuthCodeDto")
const ResetUserPasswordDto = require("../dto/user/ResetUserPasswordDto")
const ChangeUserPasswordDto = require("../dto/user/ChangeUserPasswordDto")
const DeleteUserDto = require("../dto/user/DeleteUserDto")

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

    //회원가입
    createUser: {
        method: HttpMethod.POST,
        path: "/users",
        handler: async (req, res, next) => {
            const request = new CreateUserDto(req)
            const { email } = request

            const connection = await Database.getConnection(res)
            const authCode = await UserService.createUserConnection(connection, request)

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
            const result = await UserService.loginUserConnection(connection, request)

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

            const connection = await Database.getConnection(res)
            await UserService.resetUserPassword(connection, request)

            res.output = { result: true }
            next()
        },
    },

    //비밀번호 변경
    changePasswordByUser: {
        method: HttpMethod.PUT,
        path: "/users/:userId",
        handler: async (req, res, next) => {
            const request = new ChangeUserPasswordDto(req)

            const connection = await Database.getConnection(res)
            await UserService.changeUserPassword(connection, request)

            res.output = { result: true }
            next()
        },
    },

    // 회원탈퇴
    deleteUser: {
        method: HttpMethod.DELETE,
        path: "/users/:userId",
        handler: async (req, res, next) => {
            const request = new DeleteUserDto(req)

            const connection = await Database.getConnection(res)
            await UserService.deleteUser(connection, request)

            res.output = { result: true }
            next()
        },
    },
}
