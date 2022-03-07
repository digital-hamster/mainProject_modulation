const md5 = require("md5")
const UserDao = require("../dao/UserDao") //db쿼리를 실행해야하니까


module.exports = {
    selectUserExample: async (connection) => {
        const result = await UserDao.selectUser(connection)

        if (!result || result.length < 1) {
            throw Error("사용자 정보가 없습니다")
        }

        return result
    },
    findUserExample: async (connection, request) => {
        const { limit, offset } = request
        const result = await UserDao.findUser(connection, limit, offset)

        if (!result || result.length < 1) {
            throw Error("사용자 정보가 없습니다")
        }

        return result
    },
    //회원가입
    createUserConnection: async (connection, request) => {
        //authCode발급
        const { email, nickname, password } = request
        const dateAuth = new Date()
        const authCode = md5(dateAuth + email)

        const userResult = await UserDao.createUser(connection, email, nickname, password)
        if (!userResult || userResult.length < 1) {
            throw Error("사용자 정보가 없습니다")
        }

        const authResult = await UserDao.createAuthCode(connection, authCode, email)
        if (authResult.affectedRows == 0) {
            throw Error("사용자 인증코드 생성 실패")
        }

        return authCode
    },

    // loginUser
    loginUserConnection: async (connection, request) => {
        //authCode발급
        const { email, password } = request

        const userResult = await UserDao.findUserByEmail(connection, email, password)
        if (!userResult || userResult.length < 1) {
            throw Error("사용자 정보가 없습니다")
        }

        return userResult
    },
}
