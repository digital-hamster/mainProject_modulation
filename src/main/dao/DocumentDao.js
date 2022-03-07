
module.exports = {

    selectDocumentByCategory : async (connection, category, limit, offset) => {
        const sql = `SELECT id, title, img_link, content, map_link
        FROM document
       WHERE category = ?
       ORDER BY id DESC
       LIMIT ?
      OFFSET ?;`

    const [rows] = await connection.execute(sql,[category, limit, offset])

    if (!rows || rows.length === 0) {
        throw Error("관련한 글을 더이상 불러올 수 없습니다")
        }

    return rows[0]
    },
}
