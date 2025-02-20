import { combineReducers } from "redux";

import authorizeReducer from "./authorizeReducer.js";

const rootReducer = combineReducers({
    authorize: authorizeReducer
});

export default rootReducer;