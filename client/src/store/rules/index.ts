import { combineReducers } from "@reduxjs/toolkit";
import { rulesTableSlice } from "./rulesTableSlice";
import { updateRuleModalSlice } from "./updateRuleModalSlice";
import { createRuleModalSlice } from "./createRuleModalSlice";
import { deleteRulesModalSlice } from './deleteRulesModalSlice';

const rulesReducer = combineReducers({
  rulesTable: rulesTableSlice.reducer,
  updateRuleModal: updateRuleModalSlice.reducer,
  createRuleModal: createRuleModalSlice.reducer,
  deleteRulesModal: deleteRulesModalSlice.reducer,
});

export default rulesReducer;
