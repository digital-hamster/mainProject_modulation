const Database = require("../config/Database")
const DocumentService = require("../service/DocumentService")
const HttpMethod = require("../types/HttpMethod")
const multer = require("multer")()
const AwsConfig = require("../config/AwsConfig")
const CreateDocumentDto = require("../dto/document/CreateDocumentDto")
const SelectDocumentDto = require("../dto/document/selectDocumentDto")

module.exports = {
    //게시글 업로드
    createDocument: {
        method: HttpMethod.POST,
        path: "/documents",
        multipart: multer.single("img"),
        handler: async (req, res, next) => {
            const request = new CreateDocumentDto(req)

            const connection = await Database.getConnection(res)
            await DocumentService.createDocument(connection, request)

            res.output = { result: true }
            next()
        },
    },
    //전체 게시글 조회
    selectDocument: {
        method: HttpMethod.GET,
        path: "/documents",
        handler: async (req, res, next) => {
            const request = new SelectDocumentDto(req)

            const connection = await Database.getConnection(res)
            const documentResult = await DocumentService.selectDocument(connection, request)

            res.output = { result: documentResult }
            next()
        },
    },
}