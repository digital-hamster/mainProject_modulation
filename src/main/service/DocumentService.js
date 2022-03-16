const DocumentDao = require("../dao/DocumentDao")
const AwsConfig = require("../config/AwsConfig")
module.exports = {
    //게시글 업로드
    createDocument: async (connection, request) => {
        const { title, category, userId, buffer, mimeType, content, searchWord } = request //originalname,

        //const extension = originalname.split(".")[1]
        const imgUrl = await AwsConfig.S3.upload(buffer, mimeType) //, extension
        if (!imgUrl || imgUrl.length === 0) {
            throw Error("이미지 업로드 과정에서 오류가 발생했습니다")
        }

        const result = await DocumentDao.createDocumentByRequest(
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
    selectDocument: async (connection, request) => {
        const { category, limit, offset } = request

        const documentResult = await DocumentDao.selectDocumentByCategory(connection, category, limit, offset)

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

        // 타이틀만 바꾸고싶으면 어쩌지?
        //const extension = originalname.split(".")[1]
        const imgUrl = await AwsConfig.S3.upload(buffer, mimeType) //, extension
        if (!imgUrl || imgUrl.length === 0) {
            throw Error("이미지 업로드 과정에서 오류가 발생했습니다")
        }
        //원래 있는 게시글(id)의 url을 가져오는 dao 하나 해서 그걸 imgUrl로 넘기기 >> 만약에 첨부를 안 했을 경우
        //수정을 하기 전에
        //1. 요청에url 잇는지
        //2. 만약에 없으면 select 로 imgUrl을 넘겨주는 작업 ㄱㄱ
        const result = await DocumentDao.updateDocumentByRequest(
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
    // 피드백 열받음
    deleteDocument: async (connection, request) => {
        const { documentId } = request
        const document = await DocumentDao.selectDocumentById(connection, documentId)
        //request.documentId
        //이 dao를 2번 사용하기 때문에 request.id는 빼겟..습니다 ... (select Document By id)
        if (!document | (document.length === 0)) {
            throw Error("존재하지 않는 게시물 입니다.")
        }
        const result = await DocumentDao.deleteDocumentByDocumentId(connection, document[0].id)
        if (result.affectedRows === 0) {
            throw Error("게시글 삭제에 실패했습니다")
        }
        return { result: true }
        //삭제할 시에 affectedRows 하면 성공> 1나옴 ,delete, insert >> 이거 전부
        //유저 삭제, 게시글 삭제
        //게시글 업로드, 회원가입
    },
}
