const DocumentDao = require("../dao/DocumentDao")
const AwsConfig = require("../config/AwsConfig")
module.exports = {
    //게시글 업로드
    createDocument: async (connection, request) => {
        const { title, category, userId, buffer, mimeType, content, searchWord } = request

        const imgUrl = await AwsConfig.S3.upload(buffer, mimeType)
        if (!imgUrl || imgUrl.length === 0) {
            throw Error("이미지 업로드 과정에서 오류가 발생했습니다")
        }

        const result = await DocumentDao.createDocument(
            connection,
            title,
            imgUrl,
            category,
            userId,
            content,
            searchWord
        )
        if (result.affectedRows === 0) {
            throw Error("업로드를 실패했습니다")
        }

        return { result: true }
    },
    //전체 게시글 조회
    selectDocuments: async (connection, request) => {
        const { category, limit, offset } = request

        const documentResult = await DocumentDao.selectDocumentsByCategory(connection, category, limit, offset)

        if (!documentResult || documentResult.length === 0) {
            throw Error("관련한 글을 더이상 불러올 수 없습니다")
        }

        return { result: documentResult }
    },
    //게시글수정
    updateDocument: async (connection, request) => {
        const { documentId, title, category, content, searchWord, buffer, mimeType } = request
        const document = await DocumentDao.selectDocumentById(connection, request.documentId)
        if (!document | (document.length === 0)) {
            throw Error("존재하지 않는 게시물 입니다.")
        }

        const imgUrl = await AwsConfig.S3.upload(buffer, mimeType)
        if (!imgUrl || imgUrl.length === 0) {
            throw Error("이미지 업로드 과정에서 오류가 발생했습니다")
        }

        const result = await DocumentDao.updateDocument(
            connection,
            title,
            imgUrl,
            category,
            content,
            searchWord,
            documentId
        )
        if (result.changedRows === 0) {
            throw Error("게시글 수정을 실패했습니다")
        }

        return { result: true }
    },

    //게시글삭제
    deleteDocument: async (connection, request) => {
        const { documentId } = request
        const document = await DocumentDao.selectDocumentById(connection, documentId)
        if (!document | (document.length === 0)) {
            throw Error("존재하지 않는 게시물 입니다.")
        }

        const result = await DocumentDao.deleteDocumentByDocumentId(connection, document[0].id)
        if (result.affectedRows === 0) {
            throw Error("게시글 삭제에 실패했습니다")
        }
        return { result: true }
    },
}
