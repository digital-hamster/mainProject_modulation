class UpdateDocumentDto {
    documentId = 0
    title = ""
    userId = 0
    cost = ""
    category = ""
    start_time = ""
    end_time = ""
    term = ""
    buffer = null
    mimeType = ""
    originalname = ""
    participant = 0
    content = ""
    searchWord = ""

    constructor(req) {
        const { documentId } = req.params
        const { buffer, mimeType, originalname } = req.file
        const { title, category, content, searchWord } = req.body
        const userId = req.userDetail.id

        this.documentId = documentId
        this.title = title
        this.category = category
        this.userId = userId
        this.buffer = buffer
        this.mimeType = mimeType
        this.originalname = originalname
        this.content = content
        this.searchWord = searchWord
        this.validate()
    }

    validate() {
        if (!this.documentId) {
            throw Error("게시글에 대한 정보가 없습니다")
        }
        if (!this.title) {
            throw Error("제목을 입력해주세요")
        }
        if (!this.category) {
            throw Error("항목을 입력해주세요")
        }
        if (!this.buffer) {
            throw Error("이미지를 업로드 하는 과정에서 문제가 생겼습니다 (buffer)")
        }
        if (!this.originalname) {
            throw Error("이미지를 업로드 하는 과정에서 문제가 생겼습니다 (originalname)")
        }
        if (!this.content) {
            throw Error("사용자의 리뷰를 불러올 수 없습니다")
        }
        if (!this.searchWord) {
            throw Error("사용자가 입력하고자하는 정보가 없습니다")
        }
    }
}

module.exports = UpdateDocumentDto
