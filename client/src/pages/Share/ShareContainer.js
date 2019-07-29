import React, { Component } from 'react';
import Share from './Share';
// import FullScreenLoader from '../../components/FullScreenLoader';
import { withStyles } from '@material-ui/core/styles';
import { Query } from 'react-apollo';
import { ALL_TAGS_QUERY } from '../../apollo/queries';


class ShareContainer extends Component {
  render() {
    return (
      <div>
        <Query query={ALL_TAGS_QUERY} >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            return <Share tags={data.tags} />;
          }}
        </Query>
      </div>
    )
  }
}

export default (withStyles(styles)(ShareContainer));
