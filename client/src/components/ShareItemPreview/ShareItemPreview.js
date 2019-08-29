import ItemCard from "../ItemCard/Itemcard";
import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import PropTypes from "prop-types";

const ShareItemPreview = ({ shareItemPreview, classes }) => {
  return (
    <div className={classes.container}>
      <ItemCard item={shareItemPreview} />
    </div>
  );
};

const mapStateToProps = ({ shareItemPreview }) => {
  return { shareItemPreview };
};

ShareItemPreview.prototypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(ShareItemPreview));
