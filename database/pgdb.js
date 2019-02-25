module.exports = pgPool => {
  return {
    getUser: (apiKey) => {
      return pgPool.query(`
        SELECT * FROM users
        WHERE api_key = $1
      `, [apiKey]).then(res => {
        return res.rows[0];
      })
    }
  }
}