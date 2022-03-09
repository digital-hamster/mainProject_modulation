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

    //changeAuthcode
    changeAuthConnection: async (connection, request) => {
        const { authcode } = request
        const userEmail = await UserDao.selectEmailByAuthCode(connection, authcode)
        await UserDao.selectPermissionByEmail(connection, userEmail) //check permission > 변경하려는 사용자가 정식회원인지
        const result = await UserDao.updateAuthcodeByEmail(connection, userEmail)

        if (!result || result.length < 1) {
            throw Error("정식회원 변경에 실패했습니다")
        }

        return result
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

    //비밀번호 초기화
    resetUserPassword: async (connection, email, changedPassword) => {
        const userResult = await UserDao.resetPasswordByEmail(connection, email, changedPassword)
        if (!userResult || userResult.length < 1) {
            throw Error("사용자 정보가 없습니다")
        }

        return { result : true }
    },
    //비밀번호 변경
    changeUserPasswordConnection: async (connection, password, changePw, userId) => {

        const userPassword = await UserDao.findPasswordById(connection, userId)
        if (CryptoUtil.comparePassword(password, userPassword) === false) {
            throw Error("현재 비밀번호가 일치하지 않습니다")
        }

        const result = await UserDao.changePasswordByRequest(connection, changePw, userId)
        if (!result || result.length < 1) {
            throw Error("비밀번호 변경에 실패했습니다")
        }

        return result
    },
}
