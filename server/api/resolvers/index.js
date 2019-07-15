/**
 *  @TODO: Handling Server Errors
 *
 *  Once you've completed your pg-resource.js methods and handled errors
 *  use the ApolloError constructor to capture and return errors from your resolvers.
 *
 *  Throwing ApolloErrors from your resolvers is a nice pattern to follow and
 *  will help you easily debug problems in your resolving functions.
 *
 *  It will also help you control th error output of your resource methods and use error
 *  messages on the client! (More on that later).
 *
 *  The user resolver has been completed as an example of what you'll need to do.
 *  Finish of the rest of the resolvers when you're ready.
 */
const { ApolloError } = require('apollo-server-express');

// @TODO: Uncomment these lines later when we add auth
// const jwt = require("jsonwebtoken")
// const authMutations = require("./auth")
// -------------------------------
const { DateScalar } = require('../custom-types');

module.exports = app => {
  return {
    Date: DateScalar,

    Query: {
      viewer() {
        /**
         * @TODO: Authentication - Server
         *
         *  If you're here, you have successfully completed the sign-up and login resolvers
         *  and have added the JWT from the HTTP cookie to your resolver's context.
         *
         *  The viewer is what we're calling the current user signed into your application.
         *  When the user signed in with their username and password, an JWT was created with
         *  the user's information cryptographically encoded inside.
         *
         *  To provide information about the user's session to the app, decode and return
         *  the token's stored user here. If there is no token, the user has signed out,
         *  in which case you'll return null
         */
        return null;
      },

      async user(parent, { id }, { pgResource }, info) {
        try {
          const user = await pgResource.getUserById(id);
          return user;
        } 
        catch (e) {
          throw new ApolloError(e);
        }
      },

      async items(parent, { filter }, { pgResource }, info) {
        try {
          const items = await pgResource.getItems(filter);
          return items;
        } 
        catch (e) {
          throw new ApolloError(e);
        }
      },

      async tags(parent, arg, {pgResource}, info) {
        try {
          const tags = await pgResource.getTags();
          return tags;
        }
        catch (e) {
          throw new ApolloError(e);
        }
      }
    },

    User: {
      async items({id}, args, {pgResource}, info) {
        console.log(parent)
        console.log(args)
        try {
          const itemowner = await pgResource.getItemsForUser(id);
          return itemowner;
        }
        catch (e) {
          throw new ApolloError(e);
        }
      },

      async borrowed({id}, args, {pgResource}, info) {
        console.log(parent)
        console.log(args)
        try {
          const borrower = await pgResource.getBorrowedItemsForUser(id);
          return borrower;
        }
        catch (e) {
          throw new ApolloError(e);
        }
      }
    },

    Item: {
      async itemowner({ownerid}, args, {pgResource}, info) {
        try {
          const getitemowner = await pgResource.getUserById(ownerid);
          return getitemowner;
        }
        catch (e) {
          throw new ApolloError(e);
        }
      },

      async tags({id}, args, {pgResource}, info) {
        try {
          const itemTags = await pgResource.getTagsForItem(id);
          return itemTags;
        }
        catch (e) {
          throw new ApolloError(e);
        }
      },

      async borrower({borrowerid}, args, {pgResource}, info) {
        try {
          const borrowedItem = await pgResource.getUserById(borrowerid);
          return borrowedItem;
        }
        catch (e) {
          throw new ApolloError(e);
        }
      }
    },

    Mutation: {
      // @TODO: Uncomment this later when we add auth
      // ...authMutations(app),
      // -------------------------------

      async addItem(parent, {item}, {pgResource}, info) {
        /**
         *  @TODO: Destructuring
         *
         *  The 'args' and 'context' parameters of this resolver can be destructured
         *  to make things more readable and avoid duplication.
         *
         *  When you're finished with this resolver, destructure all necessary
         *  parameters in all of your resolver functions.
         *
         *  Again, you may look at the user resolver for an example of what
         *  destructuring should look like.
         */

        // image = await image;
        // const user = await jwt.decode(context.token, app.get('JWT_SECRET'));
        try {
          const user = 1;
          const newItem = await pgResource.saveNewItem({
            item: item,
            image: undefined,
            user
          });
          return newItem;
        }
        catch (e) {
          throw new ApolloError(e);
        }
      }
    }
  };
};
