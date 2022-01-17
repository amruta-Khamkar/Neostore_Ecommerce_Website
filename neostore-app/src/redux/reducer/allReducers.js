import { cartLength,loginReducer } from "./reducer";
import { combineReducers } from "redux";

const rootReducer=combineReducers({
  cartLength:cartLength,
  loginReducer:loginReducer

})

export default rootReducer