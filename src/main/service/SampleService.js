const SampleDao = require("../dao/SampleDao")

module.exports = {
    doExample: (request, error) => {
        if (error === "true") {
            throw Error("잘못된 요청입니다.")
        }
        if (!request.value) {
            return "example API"
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
