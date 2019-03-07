const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');


const ContestStatusType = require('./contest-status');
const NameType = require('./name');

module.exports = new GraphQLObjectType({
  name: 'ContestType',

  fields: {
    id: { type: GraphQLID },
    code: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    status: { type: new GraphQLNonNull(ContestStatusType) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    names: {
      type: new GraphQLList(NameType),
      resolve: (obj, args, { loaders }) => {
        return loaders.nameForContestIds.load(obj.id);
      }
    }
  }
});