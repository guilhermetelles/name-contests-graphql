const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

const UserType = require('../types/user');

// The root query
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    me: {
      type: UserType,
      description: 'Get the current user identified by an api key',
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (obj, args, { pgdb }) => {
        return pgdb.getUserByApiKey(args.key);
      }
    }
  }
});

// The mutation query
const RootMutationQuery = new GraphQLObjectType({
  name: 'RootMutationQuery',
  fields: {
    changeUserName: {
      type: UserType,
      description: 'Change user name by id',
      args: {
        key: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (obj, args, { pgdb }) => {
        const { key, name } = args;
        return pgdb.changeUserName(key, name);
      }
    }
  }
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationQuery
});

module.exports = ncSchema;
