const Auth = require("../config/Auth")
const UserDao = require("../dao/UserDao")

module.exports = {
    checkUser: async (jwtPayload, connection) => {
        const { id, permission } = jwtPayload
        if (isNaN(id)) {
            throw Error("id 형식이 잘못되었습니다")
        }

        //유저 검증
        const user = await UserDao.findUserById(id, connection)
        if (id !== user.id) {
            throw Error("검증할 수 없는 사용자입니다.")
        }
        if (!user.id || user.id === undefined) {
            throw Error("검증할 수 없는 사용자입니다.")
        }

        //권한 검증
        const userPermission = await UserDao.findPermissionbyUser(id, connection)
        if (userPermission !== permission) {
            throw Error("사용자 정보가 변경되었습니다 재로그인 해주세요")
        }
    },
}
