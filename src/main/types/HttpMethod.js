const HttpMethod = {
    GET: {
        name: "GET",
        value: "get",
    },
    POST: {
        name: "POST",
        value: "post",
    },
    PUT: {
        name: "PUT",
        value: "put",
    },
    DELETE: {
        name: "DELETE",
        value: "delete",
    },

    has: (method) => {
        return Object.keys(HttpMethod).some((el) => HttpMethod[el] === method)
    },
}

module.exports = HttpMethod
