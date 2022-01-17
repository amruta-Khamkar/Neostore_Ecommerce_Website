import { createStore } from "redux";
import rootReducer from "./redux/reducer/allReducers";

const store =createStore(rootReducer);

export default store;

