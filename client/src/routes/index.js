import React, { Fragment } from "react";
import { Redirect, Route, Switch } from "react-router";
import HomeContainer from "../pages/Home";
import ItemsContainer from "../pages/Items";
import ProfileContainer from "../pages/Profile";
import ShareContainer from "../pages/Share";

import FullScreenLoader from "../components/FullScreenLoader";
import { ViewerContext } from "../context/ViewerProvider";
import PRoute from "../components/PrivateRoute";
import MenuBar from "../components/MenuBar";

export default () => (
  <ViewerContext.Consumer>
    {({ viewer, loading }) => {
      if (loading) return <FullScreenLoader />;

      if (!viewer) {
        return (
          <Switch>
            <Route exact path="/welcome" component={HomeContainer} />
            <Redirect from="" to="/welcome" />
          </Switch>
        );
      }
      return (
        <Fragment>
          <MenuBar />
          <Switch>
            <PRoute exact path="/items" component={ItemsContainer} />
            <PRoute exact path="/profile" componet={ProfileContainer} />
            <PRoute
              exact
              path="/profile/:userid"
              component={ProfileContainer}
            />
            <PRoute exact path="/share" component={ShareContainer} />
            <Redirect from="" to="/items" />
          </Switch>
        </Fragment>
      );
    }}
  </ViewerContext.Consumer>
);
