// const Database = require("../config/Database")
// const { FindUsersRequest } = require("../dto/FindUsersRequest")
// const DocumentService = require("../service/DocumentService")
// const HttpMethod = require("../types/HttpMethod")

// module.exports = { //이거 싹 무시
//     //유저 정보 조회 api*
//     selectUserExample: {
//         method: HttpMethod.GET,
//         path: "/users",
//         handler: async (req, res, next) => {
//             const connection = await Database.getConnection(res)
//             res.output = await UserService.selectUserExample(connection)
//             next()
//         },
//     },
//     //document limit, offset, req.query
//     FindUsersExample: {
//         method: HttpMethod.GET,
//         path: "/users",
//         handler: async (req, res, next) => {
//             const request = new FindUsersRequest(req)
//             const connection = await Database.getConnection(res)
//             res.output = await UserService.findUserExample(connection, request) //얘는 db connection
//             next()
//         },
//     },
// }