const { GraphQLScalarType } = require('graphql');

/**
 *  @TODO: Custom Types
 *  GraphQL includes the following built-in Scalar Types: https://graphql.org/learn/schema/#scalar-types
 *
 *  The purpose of the Scalar type is to validate the information being sent and received
 *  from our GraphQL API.
 *
 *  Apollo allows us to define our own custom types. We'll create our own custom type to handle the value from the 'created' field
 *  on the Item: https://www.apollographql.com/docs/graphql-tools/scalars.html
 *
 *  Once you've defined your custom DATE type, don't forget to add it to your schema.
 */

// @TOOD: Refactor this into a custom DATE scalar type using new GraphQLScalarType()
const DateScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "A date and time, represented as an ISO-8601 string",
  serialize: value => value.toISOString(),
  parseValue: value => new Date(value),
  parseLiteral: ast => new Date(ast.value)
});

module.exports = {
  DateScalar
};
