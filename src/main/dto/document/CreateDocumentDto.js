class CreateDocumentDto {
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
        const { buffer, mimeType, originalname } = req.file
        const { title, category, content, searchWord } = req.body
        const userId = req.userDetail.id

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
        if (!this.title) {
            throw Error("제목을 입력해주세요")
        }
        if (!this.category) {
            throw Error("항목을 입력해주세요")
        }
        if (!this.userId) {
            throw Error("사용자의 정보를 불러올 수 없습니다")
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

module.exports = CreateDocumentDto
