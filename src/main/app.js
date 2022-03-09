const express = require("express")
const cors = require("cors")


const ResponseHandler = require("./config/ResponseHandler")
const ErrorHandler = require("./config/ErrorHandler")
// const AsyncWrapper = require("./config/AsyncWrapper")
// const Database = require("./config/Database")
// const multer = require("multer")()
// const CryptoUtil = require("./config/CryptoUtil")
// const Auth = require("./config/Auth")
// const Mailgun = require("./config/Mailgun")
// const aws = require("./config/AWS")
const TokenMiddleware = require("./config/TokenMiddleware")

const { registerAll } = require("./controller")
const CryptoUtil = require("./config/CryptoUtil")
const app = express()
const port = process.env.NODE_ENV === "test" ? 18080 : 8080

app.use(express.json()) // json으로 들어온 요청을 parsing 해준다.
app.use(cors()) // cors 설정
app.use(TokenMiddleware.handle) //토큰 미들웨어

registerAll(app) //컨트롤러 등록

// const text = "root1234"
// const hashedText = CryptoUtil.encryptByBcrypt(text)
// const case1 = CryptoUtil.comparePassword(text, hashedText) //암호화 값 꺼내기
// console.log("case1", case1)
// const result = CryptoUtil.comparePassword("root1234", "$2b$10$$2b$10$lQZ9qICdXV2RPA6RMHPOZO64EKUobFfGq07opz3VLW5I9v11NrNZ."); //postman비번, 해시화해서 바뀐 값
// console.log("result", result) //db값에 있는 값은


app.use(ErrorHandler.handle) // 에러 핸들러
app.use(ResponseHandler.handle) // 응답 핸들러

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

module.exports = app
