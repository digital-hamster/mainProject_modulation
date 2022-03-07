const DocumentDao = require("../dao/DocumentDao") //db쿼리를 실행해야하니까
module.exports = {
    //회원가입
    selectDocument: async (connection, request) => {
        //authCode발급
        const { category, limit, offset } = request

        const documentResult = await DocumentDao.selectDocumentByCategory(connection, category, limit, offset)

        return { result: documentResult }
    },
}