module.exports = {
    verifyEmail: (email) => {
        const userEmail = email
        const isEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        if (isEmail.test(userEmail) === false) {
            return false
        }
        return true
    },
}
