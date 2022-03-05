class SampleApiRequest {
    value = ""

    constructor(req) {
        const { value } = req.query
        this.value = value
    }
}

class SampleApiResponse {
    result = ""

    constructor() {
        this.result = "Sample success"
    }
}

module.exports = { SampleApiRequest, SampleApiResponse }
