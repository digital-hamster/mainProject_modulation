const AsyncWrapper = require("../config/AsyncWrapper")
const HttpMethod = require("../types/HttpMethod")
const SampleController = require("./SampleController")

const registerAll = (app) => {
    excute(app, SampleController)
}

function excute(app, controller) {
    Object.keys(controller).forEach((el) => {
        const { method, path, multipart, handler } = controller[el]

        if (!HttpMethod.has(method)) {
            throw Error("존재하지 않는 HttpMethod 입니다.")
        }

        if (multipart) {
            app[method.value](path, multipart, AsyncWrapper.wrap(handler))
            return
        }

        app[method.value](path, AsyncWrapper.wrap(handler))
    })
}

module.exports = { registerAll }
