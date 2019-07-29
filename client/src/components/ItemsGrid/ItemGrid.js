import React from "react";
import Grid from "@material-ui/core/Grid";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
import ItemCard from "../ItemCard/Itemcard";



const ItemsGrid = ({items}) => {
  return (
    <div>
      <Grid container spacing={6}>
        {items.map(item => (
          <Grid item xs={4} key={item.id} sm={12} md={6} lg={4}>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default withStyles(styles)(ItemsGrid);
