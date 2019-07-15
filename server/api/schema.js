const { gql } = require("apollo-server-express");

module.exports = gql`

  type Item {
    id: ID!
    title: String!
    imageurl: String
    description: String!
    itemowner: User!
    tags: [Tag]
    borrower: User
  }

  type User {
    id: ID!
    email: String!
    fullname: String!
    bio: String
    items: [Item]
    borrowed: [Item]
  }

  type Tag {
    id: ID!
    title: String!
  }

  input AssignedTag {
    id: ID!
    title: String!
  }

  input NewItemInput {
    title: String!
    description: String
    tags: [AssignedTag]!
  }

  type Mutation {
    addItem(item: NewItemInput!): Item
  }

  type Query {
    user(id: ID!): User
    viewer: User
    items(filter: ID!): [Item]
    tags: [Tag]
  }
`;
