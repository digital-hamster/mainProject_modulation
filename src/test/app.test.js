const request = require("supertest")
const app = require("../main/app")

describe("/example", () => {
    describe("정상 요청을 하면", () => {
        it("정상 응답이 온다.", async () => {
            const response = await request(app)
                .get("/example")
                .set("Accept", "application/json")
                .type("application/json")
                .send()

            expect(response.status).toBe(200)
            expect(response.body).toEqual("example API")
        })
    })

    describe("잘못된 요청을 하면", () => {
        it("에러 응답이 온다.", async () => {
            const response = await request(app)
                .get("/example")
                .set("Accept", "application/json")
                .type("application/json")
                .query({ error: true })
                .send()

            expect(response.status).toBe(400)
        })
    })
})

describe("/db-test", () => {
    describe("db 연결 테스트", () => {
        it("성공", async () => {
            const response = await request(app)
                .get("/db-test")
                .set("Accept", "application/json")
                .type("application/json")
                .send()

            expect(response.status).toBe(200)
            expect(response.body).toBe("연결 성공")
        })
    })
})

describe("/health-check", () => {
    describe("서버 상태 확인", () => {
        it("성공", async () => {
            const response = await request(app)
                .get("/health-check")
                .set("Accept", "application/json")
                .type("application/json")
                .send()

            expect(response.status).toBe(200)
            expect(response.body).toBe("OK")
        })
    })
})

//회원가입
describe("createUser", () => {
    describe("사용자가 회원가입을 할 때", () => {
        it("데이터가 잘 들어가서 api가 실행된다", async () => {
            const response = await request(app)
                .post("/users")
                .set("Accept", "application/json")
                .type("application/json")
                .send({
                    email: "waterlove1212@naver.com",
                    nickname: "생계형햄스터",
                    password: "root1234",
                })

            const expectedResult = { result: true }
            expect(response.body).toEqual(expectedResult)
            expect(response.status).toBe(200)

        })
    })

    describe("DB에 중복된 값이 있어서 실패한다", () => {
        it("error", async () => {
            const response = await request(app)
                .post("/users")
                .set("Accept", "application/json")
                .type("application/json")
                .query({ error: true })
                .send()

            expect(response.status).toBe(400)
        })
    })
})

//정식회원 변경하기

//로그인
describe("login", () => {
    describe("로그인", () => {
        it("값이 일치해서 로그인이 된다", async () => {
            const response = await request(app)
                .post("/login")
                .set("Accept", "application/json")
                .type("application/json")
                .send({
                    email: "waterlove1439@naver.com",
                    password: "root1234",
                })

            const expectedResult = { result: true }
            expect(response.body).toEqual(expectedResult)
            expect(response.status).toBe(200)

        })
    })

    describe("값이 일치하지 않아서 로그인 에러가 뜬다", () => {
        it("error", async () => {
            const response = await request(app)
                .post("/login")
                .set("Accept", "application/json")
                .type("application/json")
                .query({ error: true })
                .send()

            expect(response.status).toBe(400)
        })
    })
})