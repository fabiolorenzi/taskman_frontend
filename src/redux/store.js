import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer.js";

let store = createStore(rootReducer);

export default store;