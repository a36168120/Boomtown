import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography
} from "@material-ui/core";

import Gravatar from "react-gravatar";

const ItemCard = ({ item }) => {
  return (
    <Card>
      <CardHeader
        title={item.itemowner.fullname}/>
        <Gravatar email={item.itemowner.email} />
      <CardContent>
        <Typography>{item.title}</Typography>

        <Typography>{item.description}</Typography>
      </CardContent>

      <CardActions>
        <Button>borrow</Button>
      </CardActions>
    </Card>
  );
};

export default withStyles(styles)(ItemCard);