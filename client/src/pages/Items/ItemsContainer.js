import React, { Component } from "react";
import Items from "./Items";
// import FullScreenLoader from '../../components/FullScreenLoader';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { ALL_ITEMS_QUERY } from "../../apollo/queries";

class ItemsContainer extends Component {
  render() {
    return (
      <div>
        <Query query={ALL_ITEMS_QUERY} variables={{ filter: 2 }}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            return <Items items={data.items} />;
          }}
        </Query>
      </div>
    );
  }
}

export default ItemsContainer;
