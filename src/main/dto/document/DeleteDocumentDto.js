class DeleteDocumentDto {
    docuementId = ""

    constructor(req) {
        const { documentId } = req.params

        this.documentId = documentId
        this.validate()
    }

    validate() {
        if (!this.documentId) {
            throw Error("게시글의 정보를 불러올 수 없습니다")
        }
    }
}

module.exports = DeleteDocumentDto