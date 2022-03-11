const Email = require("../../config/Email")

class ResetUserPasswordDto {
    email = ""

    constructor(req) {
        const { email } = req.body

        this.email = email
        this.validate()
    }

    validate() {
        if (!this.email) {
            throw Error("이메일을 입력해주세요")
        }
        if (Email.verifyEmail(this.email) === false) {
            throw Error("올바른 이메일 형식이 아닙니다")
        }
    }
}

module.exports = ResetUserPasswordDto
