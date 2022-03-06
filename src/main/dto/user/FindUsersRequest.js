class FindUsersRequest {
    limit = 0
    offset = 0

    constructor(req) {
        const { limit, offset } = req.query
        this.limit = limit
        this.offset = offset
    }

    //validate()
}

// class FindUsersResponse {
//     result = ""

//     constructor() {
//         this.result = "test success"
//     }
// }

module.exports = { FindUsersRequest } //, FindUsersResponse
