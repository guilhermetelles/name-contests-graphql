// prepare app
const { nodeEnv } = require('./util');
const ncSchema = require('../schema');
const graphqlHTTP = require('express-graphql');
const app = require('express')();

//prepare mongodb
const assert = require('assert');
const mdb = require('../database/mdb');
const { MongoClient } = require('mongodb');
const mConfig = require('../config/mongo')[nodeEnv];

// prepare postgres
const pg = require('pg');
const pgdb = require('../database/pgdb');
const pgConfig = require('../config/pg')[nodeEnv];
const pgPool = new pg.Pool(pgConfig);

// connect to mongodb
MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);

  // create graphql endpoint
  app.use('/graphql', graphqlHTTP({
    schema: ncSchema,
    graphiql: true,
    context: { pgdb: pgdb(pgPool), mdb: mdb(mPool) }
  }));

  // init express
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});

// go go go
console.log(`Running in ${nodeEnv} mode...`);