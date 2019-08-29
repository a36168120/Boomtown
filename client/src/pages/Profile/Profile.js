import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, CardHeader, Avatar } from "@material-ui/core";
import Gravatar from "react-gravatar";
import ItemsGrid from "../../components/ItemsGrid/ItemGrid";
import styles from "./styles";
import PropTypes from "prop-types";

const Profile = ({ classes, user }) => {
  return (
    <div className={classes.root}>
      {console.log(user)}

      <div className={classes.container}>
        <CardHeader
          className={classes.header}
          classes={{ title: classes.title }}
          title={user.fullname}
          avatar={
            <Avatar round="true" className={classes.avatar}>
              <Gravatar email={user.email} />
            </Avatar>
          }
        />
        <div className={classes.info}>
          <Typography>
            {user.items.length} Items shared {user.borrowed.length} Items
            borrowed
          </Typography>

          {user.bio === null ? (
            <Typography className={classes.bio}>"No bio provided"</Typography>
          ) : (
            <Typography className={classes.bio}>{user.bio}</Typography>
          )}
        </div>
      </div>
      <div className={classes.items}>
        {user.items && <ItemsGrid items={user.items} />}
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    borrowed: PropTypes.array.isRequired,
    bio: PropTypes.string.isRequired
  }),
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
