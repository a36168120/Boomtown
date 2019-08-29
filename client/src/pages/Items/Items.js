import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import ItemsGrid from "../../components/ItemsGrid/ItemGrid";
import PropTypes from "prop-types";

const Items = ({ classes, items }) => {
  return (
    <div className={classes.root}>
      <ItemsGrid key={items.index} items={items} />
    </div>
  );
};

Items.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired
};

export default withStyles(styles)(Items);
