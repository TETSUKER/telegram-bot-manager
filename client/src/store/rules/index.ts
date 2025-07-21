import { combineReducers } from "@reduxjs/toolkit";
import { rulesTableSlice } from "./rulesTableSlice";
import { editRuleModalSlice } from "./editRuleModalSlice";
import { addRuleModalSlice } from "./addRuleModalSlice";
import { removeRulesModalSlice } from './removeRulesModalSlice';

const rulesReducer = combineReducers({
  rulesTable: rulesTableSlice.reducer,
  editRuleModal: editRuleModalSlice.reducer,
  addRuleModal: addRuleModalSlice.reducer,
  removeRulesModal: removeRulesModalSlice.reducer,
});

export default rulesReducer;
