import gql from "graphql-tag";

/**
 * Item and user-related queries and mutations.
 */

const ItemFields = gql`
  fragment ItemFields on Item {
    id
    title
    imageurl
    description
    tags {
      id 
      title 
    }
    itemowner{
      id 
      fullname
      email
      bio
    }
    borrower {
      id 
      fullname
      email
      bio 
    }
  }
`;
// # @TODO: Query an item by its id and return the ItemFields fragment.
export const ITEM_QUERY = gql`
  query item($id: ID!) {
    item(id: $id) {
      ...ItemFields
    }
  }
  ${ItemFields}
`;

// # @TODO: Query items (optionally by tag id) and return the ItemFields fragment.
export const ALL_ITEMS_QUERY = gql`
  query items($filter: ID!) {
    items(filter: $filter) {
      ...ItemFields
    }
  }
  ${ItemFields}
`;

// # @TODO: Query the bio, email, fullname, items, and borrowed for the user by id
// # Use the ItemFields fragment for the items and borrowed fields.
export const ALL_USER_ITEMS_QUERY = gql`
  query user($id: ID!) {
    user(id: $id) {
      bio
      email
      fullname
      items {
        ...ItemFields
      }
      borrowed {
        ...ItemFields
      }
    }
  }
  ${ItemFields}
`;

// # @TODO: Query the id and title fields for tags.
export const ALL_TAGS_QUERY = gql`
  query {
    tags {
      id
      title
    }
  }
`;

// # @TODO: Pass the item and image into the addItem mutation as arguments
// # and return the new item id when the mutation is complete.
export const ADD_ITEM_MUTATION = gql`
  mutation addItem($item: NewItemInput!) {
    addItem(item: $item) {
      id
    }
  }
`;

/**
 * Auth-related queries and mutations.
 */

// @TODO: Query the id, email, fullname, and bio fields for the viewer.
export const VIEWER_QUERY = gql`
  query {
    viewer {
      id
      email
      fullname
      bio
    }
  }
`;

// @TODO: Run the logout mutation.
export const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

// @TODO: Pass the user into the signup mutation as an argument
// and return the id of the new user when the mutation is complete.
export const SIGNUP_MUTATION = gql`
  mutation signup($user: SignupInput!) {
    signup(user: $user) {
      id
    }
  }
`;

// @TODO: Pass the user into the login mutation as an argument
// and return the id of the new user when the mutation is complete.
export const LOGIN_MUTATION = gql`
  mutation login($user: LoginInput!) {
    login(user: $user) {
      id
    }
  }
`;
