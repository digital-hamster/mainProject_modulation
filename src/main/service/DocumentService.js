const DocumentDao = require("../dao/DocumentDao")
module.exports = {
    //게시글 업로드
    createDocument: async (connection, request) => {
        const { title, category, userId, buffer, mimeType, originalname, content, mapLink } = request

        const extension = originalname.split(".")[1]
        const imgUrl = await aws.S3.upload(buffer, mimeType, extension)
        if(!imgUrl || imgUrl.length===0){
            throw Error("이미지 업로드 과정에서 오류가 발생했습니다")
        }
        await DocumentDao.createDocumentByRequest(connection, title, imgUrl, category, userId, content, mapLink)


        return { result: true }
    },
    //전체 게시글 조회
    selectDocument: async (connection, request) => {
        const { category, limit, offset } = request

        const documentResult = await DocumentDao.selectDocumentByCategory(connection, category, limit, offset)
        
        return { result: documentResult }
    },
}