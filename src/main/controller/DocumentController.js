const Database = require("../config/Database")
const DocumentService = require("../service/DocumentService")
const HttpMethod = require("../types/HttpMethod")
const multer = require("multer")()
const CategoryType = require("../types/CategoryType")
const CreateDocumentDto = require("../dto/document/CreateDocumentDto")
const SelectDocumentDto = require("../dto/document/selectDocumentDto")
const UpdateDocumentDto = require("../dto/document/UpdateDocumentDto")
const DeleteDocumentDto = require("../dto/document/DeleteDocumentDto")
const AnythingUtil = require("../util/AnythingUtil")

module.exports = {
    //카테고리조회
    //피드백 (실패) 할많하않
    selectCategories: {
        method: HttpMethod.GET,
        path: "/categories",
        handler: async (req, res, next) => {
            // function checkArray(CategoryType) {
            //     //이거 다른 곳으로 모듈화로 빼고, 그 전에 형검사가 되는지부터
            //     if (!CategoryType.description) {
            //     }

            //     return CategoryType.map((el) => CategoryType[el])
            // }

            res.output = { result: AnythingUtil.enumToArray(CategoryType) }
            //res.output = { result: Object.keys(CategoryType).map((el) => CategoryType[el]) }
            //res.output = { result: Object.keys(CategoryType).map((el) => Array.isArray(CategoryType[el])) }
            next()
        },
    },
    //게시글 업로드
    //피드백 (성공)
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

            res.output = documentResult
            next()
        },
    },
    //게시글수정
    updateDocument: {
        method: HttpMethod.PUT,
        path: "/documents/:documentId",
        multipart: multer.single("img"),
        handler: async (req, res, next) => {
            const request = new UpdateDocumentDto(req)

            const connection = await Database.getConnection(res)
            await DocumentService.updateDocument(connection, request)

            res.output = { result: true }
            next()
        },
    },
    //게시글삭제
    deleteDocument: {
        method: HttpMethod.DELETE,
        path: "/documents/:documentId",
        handler: async (req, res, next) => {
            const request = new DeleteDocumentDto(req)

            const connection = await Database.getConnection(res)
            await DocumentService.deleteDocument(connection, request)

            res.output = { result: true }
            next()
        },
    },
}
