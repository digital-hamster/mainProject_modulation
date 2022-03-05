const multer = require("multer")()
const AwsConfig = require("../config/AwsConfig")
const Database = require("../config/Database")
const { SampleApiRequest } = require("../dto/sample/SampleApiDto")
const SampleService = require("../service/SampleService")
const HttpMethod = require("../types/HttpMethod")

module.exports = {
    doExample: {
        method: HttpMethod.GET,
        path: "/example",
        handler: async (req, res, next) => {
            const request = new SampleApiRequest(req)
            res.output = await SampleService.doExample(request)
            next()
        },
    },
    testDatabaseConnection: {
        method: HttpMethod.GET,
        path: "/db-test",
        handler: async (req, res, next) => {
            const connection = await Database.getConnection(res)
            res.output = await SampleService.testDatabaseConnection(connection)
            next()
        },
    },
    healhCheck: {
        method: HttpMethod.GET,
        path: "/health-check",
        handler: async (req, res, next) => {
            res.output = "OK"
            next()
        },
    },

    // 리팩토링 예제용
    testUpload: {
        method: HttpMethod.POST,
        path: "/test-upload",
        multipart: multer.single("img"),
        handler: async (req, res, next) => {
            const { buffer, mimetype } = req.file

            if (!mimetype.startsWith("image/")) {
                throw Error("이미지 파일만 등록이 가능합니다.")
            }

            const result = await AwsConfig.S3.upload(buffer, mimetype)
            res.output = { imageUrl: result }
            next()
        },
    },
}
