const humps = require('humps');
const _ = require('lodash');

module.exports = pgPool => {

  const orderedFor = (rows, collection, field) => {
    // return the rows ordered for the collection
    const data = humps.camelizeKeys(rows);
    console.log('data', data);
    const inGroupsOfField = _.groupBy(data, field);
    console.log('inGroupsOfField', inGroupsOfField);
    return collection.map(element => {
      const elementArray = inGroupsOfField[element];
      if (elementArray) {
        console.log('elementArray', elementArray);
        return elementArray[0];
      }
      return {};
    });
  };


  return {
    getUserByApiKey: (apiKey) => {
      return pgPool.query(`
        SELECT * FROM users
        WHERE api_key = $1
      `, [apiKey]).then(res => {
        // console.log(humps.camelizeKeys(res.rows[0]))
        let result = humps.camelizeKeys(res.rows[0]);
        result.firstNames = result.firstName
        delete result.firstName
        return result;
      })
    },
    getUsersByIds: (userIds) => {
      return pgPool.query(`
        SELECT * FROM users
        WHERE id = ANY($1)
      `, [userIds]).then(res => {
        return orderedFor(res.rows, userIds, 'id');
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
    getNames: (contest) => {
      return pgPool.query(`
        SELECT * FROM names
        WHERE contest_id = $1
      `, [contest.id]).then(res => {
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