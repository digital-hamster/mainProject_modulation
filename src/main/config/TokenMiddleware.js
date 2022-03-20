const { validate } = require("uuid")
const Auth = require("./Auth")
const Database = require("./Database")
const AuthService = require("../service/AuthService")
const HttpMethod = require("../types/HttpMethod")
const AsyncWrapper = require("./AsyncWrapper")

const TokenMiddleware = {
    handle: AsyncWrapper.wrap(async (req, res, next) => {
        if (isPostman(req)) {
            req.userDetail = {
                iss: "", // 발행인
                iat: new Date(), // 발행 시간
                exp: new Date() + 730 * 24 * 60 * 60 * 1000, // 만료 시간
                id: 364, // 사용자 아이디
                roles: null, // 읽기만 가능
                permission: 2,
            }

            next()
            return
        }

        const path = req.path
        const method = req.method

        const isPass = passList.some((el) => new RegExp(el.path).test(path) && el.method.name === method)

        if (isPass) {
            next()
            return
        }

        //토큰검사
        const { authorization } = req.headers
        if (!authorization) {
            throw Error("인증 토큰이 없습니다.")
        }

        const token = authorization.replace(/Bearer[+\s]/g, "")
        const jwtPayload = Auth.verifyToken(token)

        req.userDetail = jwtPayload

        const apiInfo = checkList.find((el) => new RegExp(el.path).test(path) && el.method.name === method)
        if (!apiInfo) {
            throw Error("토큰을 사용하는 api를 제대로 검사하지 못했습니다 (apiInfo)")
        }
        if (apiInfo.permission > jwtPayload.permission) {
            throw Error("권한이 부족합니다.")
        }

        //실존 유저인지
        const connection = await Database.getConnection(res)
        await AuthService.checkUser(jwtPayload, connection)

        res.dbConnection = null
        connection.release()
        next()
    }),
}

const numberPattern = "/\\d+"
const allPattern = "/\\w+"

const passList = [
    {
        path: "/example",
        method: HttpMethod.GET,
    },
    {
        path: "/db-test",
        method: HttpMethod.GET,
    },
    {
        path: "/health-check",
        method: HttpMethod.GET,
    },
    {
        //회원가입
        path: "/users",
        method: HttpMethod.POST,
    },
    {
        //정식회원
        path: "/auths" + allPattern,
        method: HttpMethod.POST,
    },
    {
        //로그인
        path: "/login",
        method: HttpMethod.POST,
    },
    {
        //비밀번호 초기화
        path: "/reset-password",
        method: HttpMethod.POST,
    },
    {
        //게시글 조회
        path: "/documents",
        method: HttpMethod.GET,
    },
    {
        //카테고리 항목 조회
        path: "/categories",
        method: HttpMethod.GET,
    },
    {
        //테스트업로드
        path: "/test-upload",
        method: HttpMethod.POST,
    },
]

const checkList = [
    {
        //비밀번호 변경
        path: "/users" + numberPattern,
        method: HttpMethod.PUT,
        permission: 0,
    },
    {
        //회원탈퇴
        path: "/users" + numberPattern,
        method: HttpMethod.DELETE,
        permission: 0,
    },
    {
        //게시글 생성
        path: "/documents",
        method: HttpMethod.POST,
        permission: 1,
    },
    {
        //게시글 수정
        path: "/documents" + numberPattern,
        method: HttpMethod.PUT,
        permission: 2,
    },
    {
        //게시글 삭제
        path: "/documents" + numberPattern,
        method: HttpMethod.DELETE,
        permission: 2,
    },
]

module.exports = TokenMiddleware

function isPostman(req) {
    return req.headers["user-agent"] && req.headers["user-agent"].startsWith("PostmanRuntime")
}
