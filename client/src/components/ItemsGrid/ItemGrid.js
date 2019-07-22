import React from "react";
import Grid from "@material-ui/core/Grid";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
import ItemCard from "../ItemCard/Itemcard";



const ItemsGrid = ({items}) => {
  return (
    <div>
      <Grid container>
        {/* {console.log(items)}         */}
        {items.map(item => (
          <Grid container direction="row" justify="center" alignItems="center">
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default withStyles(styles)(ItemsGrid);
