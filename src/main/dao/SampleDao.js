module.exports = {
    testDatabaseConnection: async (connection) => {
        const sql = `
            SELECT 1;
        `
        const [rows] = await connection.execute(sql, [])

        return rows[0]["1"] === 1 ? true : false
    },
}
