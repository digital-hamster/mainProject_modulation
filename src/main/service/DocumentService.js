const DocumentDao = require("../dao/DocumentDao")
const AwsConfig = require("../config/AwsConfig")
module.exports = {
    //게시글 업로드
    createDocument: async (connection, request) => {
        const { title, category, userId, buffer, mimeType,  content, mapLink, searchWord } = request //originalname,

        //const extension = originalname.split(".")[1]
        const imgUrl = await AwsConfig.S3.upload(buffer, mimeType)//, extension
        if(!imgUrl || imgUrl.length===0){
            throw Error("이미지 업로드 과정에서 오류가 발생했습니다")
        }
        await DocumentDao.createDocumentByRequest(connection, title, imgUrl, category, userId, content, mapLink, searchWord)

        return { result: true }
    },
    //전체 게시글 조회
    selectDocument: async (connection, request) => {
        const { category, limit, offset } = request

        const documentResult = await DocumentDao.selectDocumentByCategory(connection, category, limit, offset)
        
        return { result: documentResult }
    },
    //게시글수정
    updateDocument: async (connection, request) => {
        const { documentId, title, category, content, mapLink, searchWord, buffer, mimeType } = request

        //const extension = originalname.split(".")[1]
        const imgUrl = await AwsConfig.S3.upload(buffer, mimeType)//, extension
        if(!imgUrl || imgUrl.length===0){
            throw Error("이미지 업로드 과정에서 오류가 발생했습니다")
        }
        await DocumentDao.updateDocumentByRequest(connection, title, imgUrl, category, content, mapLink, searchWord, documentId)

        return { result: true }
    },
    //게시글삭제
    deleteDocument: async (connection, request) => {
        const { documentId } = request

        await DocumentDao.deleteDocumentByRequest(connection, documentId)

        return { result: true }
    },
}