const CryptoUtil = require("../config/CryptoUtil")

module.exports = {
    findUserById : async (id, connection) => {
        const sql = `
            SELECT id
            FROM user
            WHERE id = ?;
        `

        const [rows] = await connection.execute(sql, [id])

        if (rows.length === 0 || rows === undefined) {
            throw Error("토큰의 정보가 온전하지 못해 정보를 불러올 수 없습니다") //id 有, 토큰 정보가 잘못되어 db에서 id를 읽지 못함 >> postman:249 / token:248 이런경우임 토큰의 정보가 다름
        }

        return rows[0]
    },
    findPermissionbyUser : async (id, connection) => {
        const sql = `
            SELECT permission
            FROM user
            WHERE id = ?;
        `

        const [rows] = await connection.execute(sql, [id])

        if (rows === undefined) { //근데 에러는 어디서 모으는거야 ??????????
            throw Error("존재하지 않는 사용자입니다.")
        }

        return rows[0].permission
    },

    //회원가입 - authcode 삽입 //아니 이거 발급은 어디서 해주는거야 ??? ㅇ너ㅡ워ㅏㅂㅁ누어ㅏㅁ누ㅏ어ㅜㄴ머ㅏ류ㅜㅁ나ㅓ류 ㅂ다ㅓ륩댜ㅏㅓ류ㅓㅏㄷㅂ쥬ㅜㅅ하
    //서비스에서 발급해주고 그걸 db로 넘겨야하니까 이게 ㅣ맞는거 아녀 />??
    createUser : async (connection, email, password, nickname) => {
        const sql = `
        INSERT INTO
               user (email ,password, nickname)
        VALUES (?, ?, ?);`
    const [rows] = await connection.execute(sql, [CryptoUtil.encrypt(email), CryptoUtil.encryptByBcrypt(password), nickname])
    //[CryptoUtil.encrypt(email), CryptoUtil.encryptByBcrypt(password), nickname]

    if (rows.affectedRows == 0) {
        throw Error("사용자 정보 입력 실패")
        }
    return rows
},
    //auth-code
    createAuthCode : async (connection, authCode, email) => {
        const sql = `
         INSERT INTO
                user_auth (auth_code, user_email)
        VALUES (?, ?);
        `
    const [rows] = await connection.execute(sql, [authCode, CryptoUtil.encrypt(email)])

    if (rows.affectedRows == 0) {
        throw Error("사용자 인증코드 생성 실패")
        }
    return rows
    },

    //정식회원 변경
    //정식회원 변경 - select email
    //change authcode
    selectEmailByAuthCode : async (connection, authcode) => {
        const sql = `
         SELECT user_email
           FROM user_auth
          WHERE auth_code = ?;`
    const [rows] = await connection.execute(sql, [authcode])

    if (rows.affectedRows == 0) {
        throw Error("존재하지 않는 사용자입니다")
        }
    return rows[0].user_email
    },

    //정식회원 변경 - check permission
    selectPermissionByEmail : async (connection, userEmail) => {
        const sql =
        `SELECT permission
           FROM user
          WHERE email = ?;`
    const [rows] = await connection.execute(sql, [userEmail])

    if (rows[0].permission === 1) {
        throw Error("이미 정식회원인 사용자입니다")
    }
    return rows
    },

    //정식회원 변경 - update authcode
    updateAuthcodeByEmail : async (connection, userEmail) => {
        const sql =
        `UPDATE user
            SET permission = 1
          WHERE email = ?;`
    const [rows] = await connection.execute(sql, [userEmail])

    if (rows.affectedRows == 0) {
        throw Error("사용자 정보 변경에 실패했습니다")
        }
    return rows
    },

    //login
    findUserByEmail : async (connection, email, password) => {
        const sql = `
            SELECT id,
                permission,
                password
            FROM user
            WHERE email = ?;`
        const [rows] = await connection.execute(sql, [CryptoUtil.encrypt(email)])

        const userInform = rows[0]

        if (!userInform || rows.length === 0) {
            throw Error("존재하지 않는 사용자입니다.")
        }
        if (CryptoUtil.comparePassword(password, userInform.password) === false) {
            throw Error("로그인 실패")
        }
        return userInform
    },
    //비밀번호 초기화
    resetPasswordByEmail : async (connection, email, changedPassword) => {
        const sql =
        `UPDATE user
            SET password = ?
          WHERE email = ?;`
        const [rows] = await connection.execute(sql, [changedPassword, CryptoUtil.encrypt(email)])

        if (rows.changedRows == 0) {
            throw Error("변경 실패했습니다")
        }

        return rows
    },
}
