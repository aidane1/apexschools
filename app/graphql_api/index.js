var graphqlHTTP = require ('express-graphql');
var {buildSchema} = require ('graphql');

var schema = buildSchema (`
  type Query {
    hello: String
  }
`);

// Root resolver
var root = {
  hello: () => 'Hello world!',
};

module.exports = graphqlHTTP ({
  schema: schema, // Must be provided
  rootValue: root,
  graphiql: true,
});
