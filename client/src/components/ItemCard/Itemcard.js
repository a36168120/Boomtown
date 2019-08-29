import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  CardMedia
} from "@material-ui/core";
import moment from "moment";
import Gravatar from "react-gravatar";
import { ViewerContext } from "../../context/ViewerProvider";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ItemCard = ({ item, classes }) => {
  return (
    <ViewerContext.Consumer>
      {({ viewer }) => (
        <Card className={classes.card}>
          {console.log(item)}
          <CardMedia image={item.imageurl} className={classes.media} />
          <Link to={"/profile/" + item.itemowner.id}>
            <CardHeader
              title={
                (item.itemowner && item.itemowner.fullname) || viewer.fullname
              }
              avatar={
                <Avatar round="true" className={classes.avatar}>
                  <Gravatar
                    email={
                      (item.itemowner && item.itemowner.email) || viewer.email
                    }
                  />
                </Avatar>
              }
              subheader={moment(item.created).fromNow()}
            />
          </Link>

          <section className={classes.content}>
            <CardContent>
              <Typography component="h2" variant="h5" className={classes.text}>
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                className={classes.text}
              >
                {item.tags && item.tags.map(tag => tag.title).join(", ")}
              </Typography>

              <Typography component="h3" className={classes.text}>
                {item.description}
              </Typography>
            </CardContent>

            <CardActions>
              <Button variant="outlined" className={classes.button}>
                borrow
              </Button>
            </CardActions>
          </section>
        </Card>
      )}
    </ViewerContext.Consumer>
  );
};

ItemCard.prototypes = {
  item: PropTypes.shape({
    imageurl: PropTypes.string.isRequired,
    itemowner: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired
  }),
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ItemCard);
