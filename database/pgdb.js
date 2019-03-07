const { orderedFor } = require('../lib/util');

module.exports = pgPool => {

  return {
    getUsersByApiKeys: (apiKeys) => {
      return pgPool.query(`
        SELECT * FROM users
        WHERE api_key = ANY($1)
      `, [apiKeys]).then(res => {
        return orderedFor(res.rows, apiKeys, 'apiKey', true);
      })
    },
    getUsersByIds: (userIds) => {
      return pgPool.query(`
        SELECT * FROM users
        WHERE id = ANY($1)
      `, [userIds]).then(res => {
        return orderedFor(res.rows, userIds, 'id', true);
      })
    },
    getContestsForUserIds: (userIds) => {
      return pgPool.query(`
        SELECT * FROM contests
        WHERE created_by = ANY($1)
      `, [userIds]).then(res => {
        return orderedFor(res.rows, userIds, 'createdBy', false);
      });
    },
    getNamesForContestIds: (contestIds) => {
      return pgPool.query(`
        SELECT * FROM names
        WHERE contest_id = ANY($1)
      `, [contestIds]).then(res => {
        return orderedFor(res.rows, contestIds, 'contestId', false);
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