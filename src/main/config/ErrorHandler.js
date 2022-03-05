module.exports = {
    handle: (err, req, res, next) => {
        if (res.dbConnection) {
            res.dbConnection.release()
        }

        const { message } = err
        res.status(400)
        res.json({ error: true, message: message })
    },
}
