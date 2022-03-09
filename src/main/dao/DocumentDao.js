
module.exports = {
    createDocumentByRequest : async (connection, title, imgUrl, category, userId, content, mapLink, searchWord) => {
        const sql =
            `INSERT INTO
           document (title, img_link, user_id, category, content, map_link, search_word)
            VALUES (?, ?, ?, ?, ?, ?, ?);`

    const [rows] = await connection.execute(sql,[title, imgUrl, userId, category, content, mapLink, searchWord])

    if (rows.changedRows == 0) {
        throw Error("업로드를 실패했습니다")
    }

    return rows
    },

    selectDocumentByCategory : async (connection, category, limit, offset) => {
        const sql = `SELECT id, title, img_link, content, map_link, search_word
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

    updateDocumentByRequest : async (connection, title, imgUrl, category, content, mapLink, searchWord, documentId) => {
        const sql =
        `UPDATE document
            SET title = ?, img_link = ?, category = ?, content = ?, map_link = ?, search_word = ?
          WHERE id = ?;`

    const [rows] = await connection.execute(sql,[title, imgUrl, category, content, mapLink, searchWord, documentId])

    if (rows.changedRows == 0) {
        throw Error("게시글 수정을 실패했습니다")
    }

    return rows
    },

    deleteDocumentByRequest : async (connection, documentId) => {
        const sql =
        `DELETE
           FROM document
          WHERE id= ?`

    const [rows] = await connection.execute(sql,[documentId])

    if (!rows || rows.length === 0) {
        throw Error("게시글 삭제에 실패했습니다")
        }

    return rows
    },
    deleteDocumentByUserId : async (connection, userId) => {
        const sql =
        `DELETE
           FROM document
          WHERE user_id = ?`

    const [rows] = await connection.execute(sql,[userId])

    if (!rows || rows.length === 0) {
        throw Error("게시글 삭제에 실패했습니다")
        }

    return rows
    },

}
