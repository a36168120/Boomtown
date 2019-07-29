import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import ShareItemForm from "../../components/ShareItemForm";
import ShareItemPreview from "../../components/ShareItemPreview";

const Share = ({ classes, tags }) => {
  return (
    <div className = {classes.grid}>
     
        <div className = {classes.preview}>
          <ShareItemPreview tags = {tags} />

        </div>
        
        <div className = {classes.form}>
          <ShareItemForm tags = {tags} />

        </div>
        
    </div>
  );
};

export default withStyles(styles)(Share);
