
function tagsQueryString(tags, itemId) {
  const parts = tags.map((tag, i) => `($${i+1}, ${itemId})`);
  return parts.join(",") + ";"
}

module.exports = postgres => {
  return {
    async createUser({ fullname, email, password }) {
      const newUserInsert = {
        text: `INSERT INTO users 
        (fullname, email, password)
        VALUES ($1, $2, $3)
        RETURNING *`,
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
        text: `SELECT *
        FROM user
        WHERE email = $1`,
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
      const findUserQuery = {
        text: `SELECT * 
        FROM users 
        WHERE id = $1 
        LIMIT 1;`,
        values: [id]
        /*  values is optional, it will always be a array and it represents the "$", also positional */
      };
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
        JOIN item_tags
        ON tags.id = item_tags.tagid 
        WHERE item_tags.itemid= $1`,
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

      return new Promise((resolve, reject) => {
        postgres.connect((err, client, done) => {
          try {
            /* Begin postgres transaction */
            client.query("BEGIN", async err => {
              const { title, description, tags } = item;

              /* Generate new Item query */
              const itemQuery = {
                text: `INSERT INTO items
                (title, description, ownerid)
                VALUES ($1, $2, $3) 
                RETURNING *`,
                values: [title, description, user]
              };
              const newItem = await postgres.query(itemQuery);
              
              /* Generate tag relationships query */
              const itemId = newItem.rows[0].id;
              const tagId = tags.map(tag => tag.id);

              const itemTags = {
                text: `INSERT INTO item_tags
                (tagid, itemid )
                VALUES ${tagsQueryString([...tags], itemId)}`,
                values: tagId
              };
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
