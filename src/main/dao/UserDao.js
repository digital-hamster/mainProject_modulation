const CryptoUtil = require("../config/CryptoUtil")

module.exports = {
    //회원가입
    createUser: async (connection, email, nickname, password) => {
        const sql = `
        INSERT INTO
               user (email, nickname ,password)
        VALUES (?, ?, ?);`
        const [rows] = await connection.execute(sql, [
            CryptoUtil.encrypt(email),
            nickname,
            CryptoUtil.encryptByBcrypt(password),
        ])

        return rows
    },
    //auth-code
    createAuthCode: async (connection, authCode, email) => {
        const sql = `
         INSERT INTO
                user_auth (auth_code, user_email)
        VALUES (?, ?);
        `
        const [rows] = await connection.execute(sql, [authCode, CryptoUtil.encrypt(email)])

        return rows
    },

    //정식회원 변경
    selectAuthCode: async (connection, authcode) => {
        const sql = `
       SELECT auth_code
         FROM user_auth
        WHERE auth_code = ?;`
        const [rows] = await connection.execute(sql, [authcode])

        return rows[0]
    },

    selectEmailByAuthCode: async (connection, authcode) => {
        const sql = `
         SELECT user_email
           FROM user_auth
          WHERE auth_code = ?;`
        const [rows] = await connection.execute(sql, [authcode])

        return rows[0].user_email
    },
    selectPermissionByEmail: async (connection, userEmail) => {
        const sql = `
         SELECT permission
           FROM user
          WHERE email = ?;`
        const [rows] = await connection.execute(sql, [userEmail])

        return rows
    },
    updateAuthcodeByEmail: async (connection, userEmail) => {
        const sql = `
         UPDATE user
            SET permission = 1
          WHERE email = ?;`
        const [rows] = await connection.execute(sql, [userEmail])

        return rows
    },

    //로그인
    findUserByEmail: async (connection, email) => {
        const sql = `
         SELECT id,
                permission,
                password
           FROM user
          WHERE email = ?;`
        const [rows] = await connection.execute(sql, [CryptoUtil.encrypt(email)])
        const userInform = rows[0]

        return userInform
    },

    //비밀번호 초기화
    resetPasswordByEmail: async (connection, email, changedPassword) => {
        const sql = `
         UPDATE user
            SET password = ?
          WHERE email = ?;`
        const [rows] = await connection.execute(sql, [
            CryptoUtil.encryptByBcrypt(changedPassword),
            CryptoUtil.encrypt(email),
        ])

        return rows
    },
    findPasswordById: async (connection, userId) => {
        const sql = `
            SELECT password
              FROM user
             WHERE id = ?;`
        const [rows] = await connection.execute(sql, [userId])

        return rows[0]
    },
    changePasswordByRequest: async (connection, changePw, userId) => {
        const sql = `
         UPDATE user
            SET password = ?
          WHERE id = ?;`
        const [rows] = await connection.execute(sql, [CryptoUtil.encryptByBcrypt(changePw), userId])

        return rows
    },

    //회원탈퇴
    selectEmailByUserId: async (connection, userId) => {
        const sql = `
         SELECT email
           FROM user
          WHERE id = ?;`
        const [rows] = await connection.execute(sql, [userId])

        return rows[0].email
    },
    deleteAuthCodeByEmail: async (connection, userEmail) => {
        const sql = `
        DELETE a FROM user_auth AS a
         INNER JOIN user AS u
            ON a.user_email = u.email
         WHERE a.user_email = ?`
        const [rows] = await connection.execute(sql, [userEmail])

        return rows
    },
    deleteUserByid: async (connection, userId) => {
        const sql = `
      DELETE
        FROM user
       WHERE id= ?`
        const [rows] = await connection.execute(sql, [userId])

        return rows
    },
    findUserIdByEmail: async (connection, email) => {
        const sql = `
            SELECT id
              FROM user
             WHERE email = ?;`
        const [rows] = await connection.execute(sql, [CryptoUtil.encrypt(email)])

        return rows
    },
}
