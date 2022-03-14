const express = require("express")
const cors = require("cors")
const ResponseHandler = require("./config/ResponseHandler")
const ErrorHandler = require("./config/ErrorHandler")
const TokenMiddleware = require("./config/TokenMiddleware")

const { registerAll } = require("./controller")
// const AsyncWrapper = require("./config/AsyncWrapper")
const app = express()
const port = process.env.NODE_ENV === "test" ? 18080 : 8080

app.use(express.json()) // json으로 들어온 요청을 parsing 해준다.
app.use(cors()) // cors 설정
app.use(TokenMiddleware.handle) //토큰 미들웨어

registerAll(app) //컨트롤러 등록

app.use(ErrorHandler.handle) // 에러 핸들러
app.use(ResponseHandler.handle) // 응답 핸들러

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

module.exports = app
