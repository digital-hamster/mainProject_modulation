const Database = require("../config/Database")
const SelectDocumentDto = require("../dto/document/selectDocumentDto")
const DocumentService = require("../service/DocumentService")
// const { DocumentService } = require("../service/DocumentService")
const HttpMethod = require("../types/HttpMethod")
module.exports = {
    //전체 게시글 조회
    selectDocument: {
        method: HttpMethod.GET,
        path: "/documents",
        handler: async (req, res, next) => {
            const request = new SelectDocumentDto(req)

            const connection = await Database.getConnection(res)
            const documentResult = await DocumentService.selectDocument(connection, request)

            res.output = documentResult
            next()
        },
    },
}