const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')
const ContestType = require('./contest')

module.exports = new GraphQLObjectType({
  name: 'MeType',

  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    fullName: {
      deprecationReason: 'não gostei',
      type:  GraphQLString,
      description: 'Custom field that concats the first and last name',
      resolve: obj => `${obj.firstName} ${obj.lastName}`
    },
    email: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLString },
    contests: {
      type: new GraphQLList(ContestType),
      resolve(obj, args, { pgdb }) {
        return pgdb.getContests(obj)
      }
    }
  }
});