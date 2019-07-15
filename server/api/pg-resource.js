function tagsQueryString(tags, itemid, result) {
  /**
   * Challenge:
   * This function is more than a little complicated.
   *  - Can you refactor it to be simpler / more readable?
   */
  const length = tags.length;
  return length === 0
    ? `${result};`
    : tags.shift() &&
        tagsQueryString(
          tags,
          itemid,
          `${result}($${tags.length + 1}, ${itemid})${length === 1 ? "" : ","}`
        );
}

module.exports = postgres => {
  return {
    async createUser({ fullname, email, password }) {
      const newUserInsert = {
        text: "", // @TODO: Authentication - Server
        values: [fullname, email, password]
      };
      try {
        const user = await postgres.query(newUserInsert);
        return user.rows[0];
      } catch (e) {
        switch (true) {
          case /users_fullname_key/.test(e.message):
            throw "An account with this username already exists.";
          case /users_email_key/.test(e.message):
            throw "An account with this email already exists.";
          default:
            throw "There was a problem creating your account.";
        }
      }
    },
    async getUserAndPasswordForVerification(email) {
      const findUserQuery = {
        text: "", // @TODO: Authentication - Server
        values: [email]
      };
      try {
        const user = await postgres.query(findUserQuery);
        if (!user) throw "User was not found.";
        return user.rows[0];
      } 
      catch (e) {
        throw "User was not found.";
      }
    },
    async getUserById(id) {
      /**
       *  @TODO: Handling Server Errors
       *
       *  Inside of our resource methods we get to determine when and how errors are returned
       *  to our resolvers using try / catch / throw semantics.
       *
       *  Ideally, the errors that we'll throw from our resource should be able to be used by the client
       *  to display user feedback. This means we'll be catching errors and throwing new ones.
       *
       *  Errors thrown from our resource will be captured and returned from our resolvers.
       *
       *  This will be the basic logic for this resource method:
       *  1) Query for the user using the given id. If no user is found throw an error.
       *  2) If there is an error with the query (500) throw an error.
       *  3) If the user is found and there are no errors, return only the id, email, fullname, bio fields.
       *     -- this is important, don't return the password!
       *
       *  You'll need to complete the query first before attempting this exercise.
       */

      const findUserQuery = {
        text: `SELECT * 
        FROM users 
        WHERE id = $1 
        LIMIT 1;`,
        values: [id]
        // values is optional, it will always be a array and it represents the "$", also positional
      };

      /**
       *  Refactor the following code using the error handling logic described above.
       *  When you're done here, ensure all of the resource methods in this file
       *  include a try catch, and throw appropriate errors.
       *
       *  Ex: If the user is not found from the DB throw 'User is not found'
       *  If the password is incorrect throw 'User or Password incorrect'
       */
      try {
        const user = await postgres.query(findUserQuery);
        return user.rows[0];
      } 
      catch (e) {
        throw "User was not found.";
      }
    },

    async getItems(idToOmit) {
      const getItems = {
        text: `SELECT *
        FROM items
        WHERE ownerid != $1
        `,
        values: idToOmit ? [idToOmit] : []
      };
      try {
        const items = await postgres.query(getItems);
        return items.rows;
      } 
      catch (e) {
        throw "Items were not found.";
      }
    },

    async getItemsForUser(id) {
      const getItemsForUser = {
        text: `SELECT *
        FROM items
        WHERE ownerid = $1`,
        values: [id]
      };
      try {
        const items = await postgres.query(getItemsForUser);
        return items.rows;
      } 
      catch (e) {
        throw "Items were not found for owner.";
      }
    },

   async getBorrowedItemsForUser(id) {
      const getBorrowedItemsForUser = {
        text: `SELECT *
        FROM items
        WHERE borrowerid = $1`,
        values: [id]
      };
      try {
        const items = await postgres.query(getBorrowedItemsForUser);
        return items.rows;
      } 
      catch (e) {
        throw "Items were not found for borrower.";
      }
    },

    async getTags() {
      const getTags = {
        text: `SELECT *
        FROM tags`
      };
      try {
        const tags = await postgres.query(getTags);
        return tags.rows;
      } 
      catch (e) {
        throw "Tags were not found.";
      }
    },

    async getTagsForItem(id) {
      const tagsQuery = {
        text: `SELECT * 
        FROM tags 
        JOIN items_tag
        ON tags.id = items_tag.tagid 
        WHERE items_tag.itemid= $1`,
        values: [id]
      };
      try {
        const tags = await postgres.query(tagsQuery);
        return tags.rows;
      } 
      catch (e) {
        throw "Tags were not found for item.";
      }
    },

    async saveNewItem({ item, user }) {
      /**
       *  @TODO: Adding a New Item
       *
       *  Adding a new Item to Posgtres is the most advanced query.
       *  It requires 3 separate INSERT statements.
       *
       *  All of the INSERT statements must:
       *  1) Proceed in a specific order.
       *  2) Succeed for the new Item to be considered added
       *  3) If any of the INSERT queries fail, any successful INSERT
       *     queries should be 'rolled back' to avoid 'orphan' data in the database.
       *
       *  To achieve #3 we'll ue something called a Postgres Transaction!
       *  The code for the transaction has been provided for you, along with
       *  helpful comments to help you get started.
       *
       *  Read the method and the comments carefully before you begin.
       */

      return new Promise((resolve, reject) => {
        /**
         * Begin transaction by opening a long-lived connection
         * to a client from the client pool.
         * - Read about transactions here: https://node-postgres.com/features/transactions
         */
        postgres.connect((err, client, done) => {
          try {
            // Begin postgres transaction
            client.query("BEGIN", async err => {
              const { title, description, tags } = item;

              const itemQuery = {
                text: `INSERT INTO items
                (title, description, ownerid)
                VALUES ($1, $2, $3) 
                RETURNING *`,
                values: [title, description, user]
              };
              const newItem = await postgres.query(itemQuery);

              const itemId = newItem.rows[0].id;
              const tagId = tags.map(tag => tag.id);
              console.log(tagId);
              console.log(itemId)
              // console.log([...tagId]);
              const itemTags = {
                text: `INSERT INTO items_tag
                (tagid, itemid )
                VALUES ${tagsQueryString(tags, itemId, " ")}`,
                values: tagId
              };
              console.log(itemTags);
              const newItemTags = await postgres.query(itemTags);
              
              client.query("COMMIT", err => {
                if (err) {
                  throw err;
                }

                done();
                resolve(newItem.rows[0])
              });
            });
          } 
          catch (e) {
            
            client.query("ROLLBACK", err => {
              if (err) {
                throw err;
              }
              done();
            });
            switch (true) {
              default:
                throw e;
            }
          }
        });
      });
    }
  };
};
