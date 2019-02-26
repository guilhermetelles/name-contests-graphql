const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

const MeType = require('../types/me');

// The root query is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    me: {
      type: MeType,
      description: 'Get the current user identified by an api key',
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (obj, args, { pgdb }) => {
        return pgdb.getUser(args.key);
      }
    }
  }
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: {}
});

module.exports = ncSchema;