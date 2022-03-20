module.exports = {
    createDocument: async (connection, title, imgUrl, category, userId, content, searchWord) => {
        const sql = `
        INSERT INTO
      document (title, img_link, user_id, category, content, search_word)
        VALUES (?, ?, ?, ?, ?, ?);`

        const [rows] = await connection.execute(sql, [title, imgUrl, userId, category, content, searchWord])

        return rows
    },

    selectDocumentsByCategory: async (connection, category, limit, offset) => {
        const sql = `
      SELECT id, title, img_link, content, search_word
        FROM document
       WHERE category = ?
       ORDER BY id DESC
       LIMIT ?
      OFFSET ?;`

        const [rows] = await connection.execute(sql, [category, limit, offset])

        return rows[0]
    },

    updateDocument: async (connection, title, imgUrl, category, content, searchWord, documentId) => {
        const sql = `
        UPDATE document
           SET title = ?, img_link = ?, category = ?, content = ?, search_word = ?
         WHERE id = ?;`

        const [rows] = await connection.execute(sql, [title, imgUrl, category, content, searchWord, documentId])

        return rows
    },

    selectDocumentById: async (connection, documentId) => {
        const sql = `
         SELECT *
           FROM document
          WHERE id= ?`

        const [rows] = await connection.execute(sql, [documentId])

        return rows
    },

    deleteDocumentByDocumentId: async (connection, documentId) => {
        const sql = `
         DELETE
           FROM document
          WHERE id= ?`

        const [rows] = await connection.execute(sql, [documentId])

        return rows
    },
    deleteDocumentByUserId: async (connection, userId) => {
        const sql = `
         DELETE
           FROM document
          WHERE user_id = ?`

        const [rows] = await connection.execute(sql, [userId])

        return rows
    },
}
