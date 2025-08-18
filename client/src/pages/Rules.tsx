import React from "react";
import {
  RulesTable,
  CreateRuleModal,
  AddRuleButton,
  UpdateRuleModal,
  RefreshRulesButton,
  RemoveRulesButton,
  DeleteRulesModal,
} from "use-cases/rules";

export const Rules: React.FC = () => {
  return (
    <>
      <div className="flex gap-x-2 py-[10px]">
        <RefreshRulesButton />
        <AddRuleButton />
        <RemoveRulesButton />
      </div>
      <RulesTable />

      <CreateRuleModal />
      <UpdateRuleModal />
      <DeleteRulesModal />
    </>
  );
};
