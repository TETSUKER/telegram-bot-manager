import React from "react";
import {
  RulesTable,
  AddRuleModal,
  AddRuleButton,
  EditRuleModal,
  RefreshRulesButton,
  RemoveRulesButton,
  RemoveRulesModal,
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

      <AddRuleModal />
      <EditRuleModal />
      <RemoveRulesModal />
    </>
  );
};
