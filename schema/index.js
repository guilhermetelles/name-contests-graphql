const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');

const UserType = require('../types/user');
const AddContestMutation = require('../mutations/add-contest');
const AddNameMutation = require('../mutations/add-name');

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
      resolve: (obj, args, { loaders }) => {
        return loaders.usersByApiKeys.load(args.key);
      }
    }
  }
});

// The mutation query
const RootMutationType = new GraphQLObjectType({
  name: 'RootMutation',

  fields: () => ({
    AddContest: AddContestMutation,
    AddName: AddNameMutation
  })
});


const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = ncSchema;
