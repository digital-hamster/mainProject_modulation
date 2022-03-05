const SampleDao = require("../dao/SampleDao")

module.exports = {
    doExample: (request) => {
        if (!request.value) {
            return "hello world!"
        }

        return request.value
    },

    testDatabaseConnection: async (connection) => {
        const result = await SampleDao.testDatabaseConnection(connection)

        if (result === false) {
            throw Error("연결 실패")
        }

        return "연결 성공"
    },
}
