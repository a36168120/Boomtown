import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import ItemsGrid from '../../components/ItemsGrid/ItemGrid';

const Items = ({ classes, items }) => {
  return (
    <div>
      <p>
        This is the items page located at <code>/items</code>.
      </p>
      <ItemsGrid key = {items.index} items = {items} />
    </div>
  );
};

export default withStyles(styles)(Items);
