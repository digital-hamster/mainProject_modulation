const res = require("express/lib/response")
const request = require("supertest")
const app = require("../main/app")
const Auth = require("../main/config/Auth")
const path = require("path")
const CategoryType = require("../main/types/CategoryType")

describe("/example", () => {
    describe("정상 요청을 하면", () => {
        it("정상 응답이 온다.", async () => {
            const response = await request(app)
                .get("/example")
                .set("Accept", "application/json")
                .type("application/json")
                .send()

            expect(response.status).toBe(200)
            expect(response.body).toBe("example API") //toEqual
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

//이미지 테스트
describe("/image-upload-test", () => {
    describe("이미지 업로드 테스트", () => {
        it("성공", async () => {
            const response = await request(app)
                .post("/test-upload")
                .set("Accept", "application/json")
                .type("form")
                .field("title", "안녕하세요")
                .attach("img", path.resolve(__dirname, "./testImg.jpg"))
                .set("Connection", "keep-alive")

            // expect(response.body).toBe("OK") // >>게시글 업로드와 수정에는 x
            expect(response.status).toBe(200)
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
                    email: "wateerlove1439@naver.com",
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
                .send({
                    email: "waterlove1439@naver.com",
                })

            expect(response.status).toBe(400)
        })
    })

    describe("이메형이 아니여서", () => {
        it("실패한다", async () => {
            const response = await request(app)
                .post("/users")
                .set("Accept", "application/json")
                .type("application/json")
                .query({ error: true })
                .send({
                    email: "waterlove1212naver.com",
                })

            expect(response.status).toBe(400)
        })
    })
})

//정식회원 변경하기
describe("changeAuthByUser", () => {
    describe("사용자가 정식회원 요청을 할 때", () => {
        it("데이터가 잘 들어가서 api가 실행된다", async () => {
            const response = await request(app)
                .post("/auths/8f34b17ef9f7cd756d902fd4439d253e")
                .set("Accept", "application/json")
                .type("application/json")
                .send()

            const expectedResult = { result: true }
            expect(response.body).toEqual(expectedResult)
            expect(response.status).toBe(200)
        })
    })

    describe("DB에 중복된 값이 있어서", () => {
        it("실패한다", async () => {
            const response = await request(app)
                .get("/users")
                .set("Accept", "application/json")
                .type("application/json")
                .query({ error: true })
                .send()

            expect(response.status).toBe(400)
        })
    })
})

//로그인
describe("사용자가 로그인을 시도할 때", () => {
    describe("이메일과 비밀번호가", () => {
        it("일치해서 로그인이 된다", async () => {
            const response = await request(app)
                .post("/login")
                .set("Accept", "application/json")
                .type("application/json")
                .send({
                    email: "waterlove121@naver.com",
                    password: "root1234",
                })

            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                expect.objectContaining({
                    result: {
                        Token: expect.any(String),
                    },
                    formalMember: expect.any(Boolean),
                    admin: expect.any(Boolean),
                })
            )
        })
    })
    describe("불일치해서", () => {
        it("로그인 에러가 뜬다", async () => {
            const response = await request(app)
                .post("/login")
                .set("Accept", "application/json")
                .type("application/json")
                .query({ error: true })
                .send()

            expect(response.status).toBe(400)
        })
    })
    describe("이메일이 틀렸다", () => {
        it("존재하지 않는 사용자이다", async () => {
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

// //비밀번호 초기화
describe("resetPasswordByUser", () => {
    describe("사용자가 비밀번호 초기화를 할 때", () => {
        it("이메일이 보내진다", async () => {
            const response = await request(app)
                .post("/reset-password")
                .set("Accept", "application/json")
                .type("application/json")
                .send({
                    //바디
                    email: "waterlove1439@naver.com",
                })

            const expectedResult = { result: true }
            expect(response.body).toEqual(expectedResult)
            expect(response.status).toBe(200)
        })
    })

    describe("이메일 형식이 아니여서", () => {
        it("에러가 뜬다", async () => {
            const response = await request(app)
                .post("/reset-password")
                .set("Accept", "application/json")
                .type("application/json")
                .query({ error: true })
                .send({
                    //바디
                    email: "waterlove1212naver.com",
                })
            expect(response.status).toBe(400)
        })
    })
})

// //비밀번호 변경
describe("사용자가 비밀번호 변경을 시도할 때", () => {
    //토큰설정
    const id = 9999
    const permission = 2
    const Token = Auth.signToken(id, permission)
    describe("비밀번호가 일치해서", () => {
        it("보내는 값으로 비밀번호가 변경된다", async () => {
            const response = await request(app)
                .put("/users/" + id)
                .set("Accept", "application/json")
                .type("application/json")
                .set("authorization", Token)
                .send({
                    password: "root1234",
                    changePw: "root12345",
                })
            console.log(response.body)

            const expectedResult = { result: true }
            res.output = expectedResult
            expect(response.status).toBe(200)
        })
    })

    describe("비밀번호가 일치하지 않아서", () => {
        it("에러가 뜬다", async () => {
            const response = await request(app)
                .put("/users/" + id)
                .set("Accept", "application/json")
                .type("application/json")
                .set("authorization", Token)
                .query({ error: true })
                .send({
                    password: "rootd123d45",
                    changePw: "root1234",
                })
            expect(response.status).toBe(400)
        })
    })
})

// //회원탈퇴
describe("사용자가 회원탈퇴를 시도할 때", () => {
    const id = 10016
    const permission = 0
    const Token = Auth.signToken(id, permission)
    describe("데이터가 잘 보내져서", () => {
        it("회원탈퇴가 완료된다", async () => {
            const response = await request(app)
                .delete("/users/" + id)
                .set("Accept", "application/json")
                .set("authorization", Token)
                .type("application/json")
                .send({
                    email: "wateerlove1439@gmail.com",
                })

            const expectedResult = { result: true }
            expect(response.body).toEqual(expectedResult)
            expect(response.status).toBe(200)
        })
    })

    describe("이메일 형식이 아니여서", () => {
        it("에러가 뜬다", async () => {
            const response = await request(app)
                .delete("/users/" + id)
                .set("Accept", "application/json")
                .type("application/json")
                .set("authorization", Token)
                .query({ error: true })
                .send({
                    email: "waterlove1212naver.com",
                })
            expect(response.status).toBe(400)
        })
    })

    describe("존재하지 않는 사용자여서", () => {
        it("에러가 뜬다", async () => {
            const response = await request(app)
                .delete("/users/" + 1)
                .set("Accept", "application/json")
                .type("application/json")
                .set("authorization", Token)
                .query({ error: true })
                .send({
                    email: "wate4rlov21e1212@naver.com",
                })
            expect(response.status).toBe(400)
        })
    })
})

// //카테고리 조회
describe("프론트가 카테고리를 조회할 때", () => {
    describe("요청이 잘 보내져서", () => {
        it("CategoryType이 잘 나온다", async () => {
            //error: 인증 토큰이 없습니다
            const response = await request(app)
                .get("/categories")
                .set("Accept", "application/json")
                .type("application/json")
                .send()

            const expectedResult = {
                result: {
                    PIZZA: {
                        name: "PIZZA",
                    },
                    CHICKEN: {
                        name: "CHICKEN",
                    },
                    BURGER: {
                        name: "BURGER",
                    },
                    CHINESE: {
                        name: "CHINESE",
                    },
                    NOODLE: {
                        name: "NOODLE",
                    },
                    PASTA: {
                        name: "PASTA",
                    },
                },
            } //이건 어떤식으로 표현해야하냐
            expect(response.body).toEqual(expectedResult)
            expect(response.status).toBe(200)
        })
    })
})

// //게시글 조회
describe("사용자가 게시글을 조회할 때", () => {
    describe("카테고리에 글이 존재해서", () => {
        it("해당 카테고리의 전체 게시글 정보가 보여진다", async () => {
            //error: 인증 토큰이 없습니다
            const response = await request(app)
                .get("/documents")
                .set("Accept", "application/json")
                .type("application/json")
                .query({ limit: 3, offset: 0, category: "ForTest" }) //테스트 돌릴 용도의 카테고리입니다

            expect(response.status).toBe(200)
            expect(response.body).toEqual(
                expect.objectContaining({
                    result: {
                        id: expect.any(Number),
                        title: expect.any(String),
                        img_link: expect.any(String),
                        content: expect.any(String),
                        search_word: expect.any(String),
                    },
                })
            )
        })
    })

    describe("해당 카테고리의 글이 없으면", () => {
        it("에러가 뜬다", async () => {
            const response = await request(app)
                .get("/documents")
                .set("Accept", "application/json")
                .type("application/json")
                .send()
                .query({ error: true })

            expect(response.status).toBe(400)
        })
    })
})

//게시글 업로드
describe("사용자가 게시글을 올릴 때", () => {
    const id = 9999
    const permission = 2
    const Token = Auth.signToken(id, permission)

    const testImg = "/testImg.jpg"

    describe("값이 문제없이 들어가서", () => {
        it("게시글 업로드가 성공한다", async () => {
            const response = await request(app)
                .post("/documents")
                .set("Accept", "application/json")
                .set("authorization", Token)
                .type("form")
                .field("title", "테스트용")
                .field("category", "ForTeㅇst")
                .field("userId", 9999)
                .attach("img", path.resolve(__dirname, "./testImg.jpg"))
                .field("content", "테스트용입니다")
                .field("searchWord", "테스트용입니다")
                .set("Connection", "keep-alive")

            // const expectedResult = { result: true }
            // expect(response.body).toEqual(expectedResult)
            expect(response.status).toBe(200)
        })
    })

    describe("제대로 값을 넣지 않아", () => {
        it("에러가 뜬다", async () => {
            const response = await request(app)
                .get("/documents")
                .set("Accept", "application/json")
                .type("application/json")
                .set("authorization", Token)
                .send()
                .query({ error: true })

            expect(response.status).toBe(400)
        })
    })
})

//게시글 수정
describe("관리자가 게시글을 수정할 때", () => {
    const id = 9999
    const permission = 2
    const Token = Auth.signToken(id, permission)
    const documentId = 218

    describe("값이 문제없이 들어가서", () => {
        it("게시글 수정이 성공한다", async () => {
            const response = await request(app)
                .put("/documents/" + documentId)
                .set("Accept", "application/json")
                .set("authorization", Token)
                .type("form")
                .field("title", "테스트용")
                .field("category", "ForTest")
                .field("userId", 9999)
                .attach("img", path.resolve(__dirname, "./testImg.jpg"))
                .field("content", "테스트용입니다")
                .field("searchWord", "테스트용입니다")
                .set("Connection", "keep-alive")

            const expectedResult = { result: true }
            expect(response.body).toEqual(expectedResult)
            expect(response.status).toBe(200)
        })
    })

    describe("제대로 값을 넣지 않아", () => {
        it("에러가 뜬다", async () => {
            const response = await request(app)
                .put("/documents/" + documentId)
                .set("Accept", "application/json")
                .type("application/json")
                .set("authorization", Token)
                .send()
                .query({ error: true })

            expect(response.status).toBe(400)
        })
    })
})

// //게시글 삭제
describe("관리자가 게시글을 삭제할 때", () => {
    const id = 9999
    const permission = 2
    const Token = Auth.signToken(id, permission)

    describe("요청이 제대로 들어가", () => {
        it("게시글 삭제에 성공한다", async () => {
            const documentId = 218
            const response = await request(app)
                .delete("/documents/" + documentId)
                .set("Accept", "application/json")
                .type("application/json")
                .set("authorization", Token)
                .query()
                .send()

            const expectedResult = { result: true }
            expect(response.body).toEqual(expectedResult)
            expect(response.status).toBe(200)
        })
    })

    describe("존재하지 않는 게시글이라", () => {
        const documentId = 1
        it("에러가 뜬다", async () => {
            const response = await request(app)
                .delete("/documents/" + documentId)
                .set("Accept", "application/json")
                .type("application/json")
                .set("authorization", Token)
                .query({ error: true })
                .send()

            expect(response.status).toBe(400)
        })
    })
})
