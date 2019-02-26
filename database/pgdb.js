const humps = require('humps');

module.exports = pgPool => {
  return {
    getUser: (apiKey) => {
      return pgPool.query(`
        SELECT * FROM users
        WHERE api_key = $1
      `, [apiKey]).then(res => {
        console.log(humps.camelizeKeys(res.rows[0]))
        return humps.camelizeKeys(res.rows[0]);
      })
    },
    getContests: (user) => {
      return pgPool.query(`
        SELECT * FROM contests
        WHERE created_by = $1
      `, [user.id]).then(res => {
        return humps.camelizeKeys(res.rows);
      });
    },
    changeUserName: (apiKey, name) => {
      return pgPool.query(`
        UPDATE users
        SET first_name = $1
        WHERE api_key = $2
      `, [name, apiKey]).then(res => {
        return pgPool.query(`
        SELECT * FROM users
        WHERE api_key = $1
      `, [apiKey])
      }).then(res => {
        console.log(humps.camelizeKeys(res.rows[0]))
        return humps.camelizeKeys(res.rows[0]);
      })
    }
  }
}