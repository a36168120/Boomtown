const { ApolloError } = require("apollo-server-express");

const jwt = require("jsonwebtoken");
const authMutations = require("./auth");

const { DateScalar } = require("../custom-types");

module.exports = app => {
  return {
    Date: DateScalar,

    Query: {
      viewer(parent, arg, context) {
        if (context.token) {
          return jwt.decode(context.token, app.get("JWT_SECRET"));
        }
        return null;
      },

      async user(parent, { id }, { pgResource }, info) {
        try {
          const user = await pgResource.getUserById(id);
          return user;
        } catch (e) {
          throw new ApolloError(e);
        }
      },

      async items(parent, { filter }, { pgResource }, info) {
        try {
          const items = await pgResource.getItems(filter);
          return items;
        } catch (e) {
          throw new ApolloError(e);
        }
      },

      async tags(parent, arg, { pgResource }, info) {
        try {
          const tags = await pgResource.getTags();
          return tags;
        } catch (e) {
          throw new ApolloError(e);
        }
      }
    },

    User: {
      async items({ id }, args, { pgResource }, info) {
        try {
          const itemowner = await pgResource.getItemsForUser(id);
          return itemowner;
        } catch (e) {
          throw new ApolloError(e);
        }
      },

      async borrowed({ id }, args, { pgResource }, info) {
        try {
          const borrower = await pgResource.getBorrowedItemsForUser(id);
          return borrower;
        } catch (e) {
          throw new ApolloError(e);
        }
      }
    },

    Item: {
      async itemowner({ ownerid }, args, { pgResource }, info) {
        try {
          const getitemowner = await pgResource.getUserById(ownerid);
          return getitemowner;
        } catch (e) {
          throw new ApolloError(e);
        }
      },

      async tags({ id }, args, { pgResource }, info) {
        try {
          const itemTags = await pgResource.getTagsForItem(id);
          return itemTags;
        } catch (e) {
          throw new ApolloError(e);
        }
      },

      async borrower({ borrowerid }, args, { pgResource }, info) {
        try {
          const borrowedItem = await pgResource.getUserById(borrowerid);
          return borrowedItem;
        } catch (e) {
          throw new ApolloError(e);
        }
      }
    },

    Mutation: {
      ...authMutations(app),
      async addItem(parent, { item }, context, info) {
        const user = await jwt.decode(context.token, app.get("JWT_SECRET"));
        try {
          const newItem = await context.pgResource.saveNewItem({
            item: item,
            image: undefined,
            user: user
          });
          return newItem;
        } catch (e) {
          throw new ApolloError(e);
        }
      }
    }
  };
};
