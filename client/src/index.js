import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import registerServiceWorker from "./registerServiceWorker";
import theme from "./theme";
import client from "./apollo";
import AppRoutes from "./routes";
import store from "./redux";
import {ViewerProvider} from "./context/ViewerProvider";
import "./index.css";

const App = () => {
  return (
    <ReduxProvider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ApolloProvider client={client}>
          <ViewerProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ViewerProvider>
        </ApolloProvider>
      </MuiThemeProvider>
    </ReduxProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
