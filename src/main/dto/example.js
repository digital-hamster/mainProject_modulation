class ExampleRequest {
    value = ""

    constructor(req) {
        const { value } = req.query
        this.value = value
    }
}

class ExampleResponse {
    result = ""

    constructor() {
        this.result = "test success"
    }
}

module.exports = { ExampleRequest, ExampleResponse }
