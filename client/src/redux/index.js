import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ShareItemPreviewReducer from './ShareItemPreview/reducer';


const middleware = [];

const store = createStore(
  combineReducers({
    shareItemPreview: ShareItemPreviewReducer
  }),
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
