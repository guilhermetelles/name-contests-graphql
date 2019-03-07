// prepare app
const { nodeEnv } = require('./util');
const ncSchema = require('../schema');
const graphqlHTTP = require('express-graphql');
const app = require('express')();
const DataLoader = require('dataloader')

//prepare mongodb
const assert = require('assert');
const mdb = require('../database/mdb');
const { MongoClient, Logger } = require('mongodb');
const mConfig = require('../config/mongo')[nodeEnv];

// prepare postgres
const pg = require('pg');
const pgConfig = require('../config/pg')[nodeEnv];
const pgPool = new pg.Pool(pgConfig);
const pgdb = require('../database/pgdb')(pgPool);

// connect to mongodb
MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);
  const mdbPooled = mdb(mPool);

  // create graphql endpoint
  app.use('/graphql', (req, res) => {
    const loaders = {
      usersByIds: new DataLoader(pgdb.getUsersByIds),
      usersByApiKeys: new DataLoader(pgdb.getUsersByApiKeys),
      nameForContestIds: new DataLoader(pgdb.getNamesForContestIds),
      contestsForUserIds: new DataLoader(pgdb.getContestsForUserIds),
      totalVotesByNameIds: new DataLoader(pgdb.getTotalVotesByNameIds),
      activitiesForUserIds: new DataLoader(pgdb.getActivitiesForUserIds),
      mdb: {
        usersByIds: new DataLoader(mdbPooled.getUsersByIDs),
      }
    }
    graphqlHTTP({
      schema: ncSchema,
      graphiql: true,
      context: { pgdb: pgdb, mdb: mdbPooled, loaders }
    })(req, res);
  });

  // init express
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});

// go go go
console.log(`Running in ${nodeEnv} mode...`);