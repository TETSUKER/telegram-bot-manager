import React from "react";
import {
  Table,
  TableCheckbox,
  TableMasterCheckbox,
  TableData,
} from "components";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { toggleSelectItem, toggleSelectAll } from "store/rules/rulesTableSlice";
import { ServerRule } from "api/rules";
import { updateRules } from "store/rules/rulesTableSlice";
import { openUpdateRuleModal } from "store/rules/updateRuleModalSlice";
import { Status } from "store/interfaces";

interface RulesTableRow {
  id: number;
  name: string;
  checkbox: React.JSX.Element;
}

export const RulesTable: React.FC = () => {
  const rulesTableState = useAppSelector((state) => state.rule.rulesTable);
  const dispatch = useAppDispatch();
  const headerCells = [
    <TableMasterCheckbox
      checked={rulesTableState.isAllSelected}
      onChange={() => dispatch(toggleSelectAll())}
      indeterminate={rulesTableState.isSomeSelected}
    />,
    "ID",
    "Rule name",
    "Condition type",
    "Response type",
    "Probability",
  ];
  const [rulesTableData, setRulesTableData] = React.useState<
    TableData<RulesTableRow>
  >({ headerCells, rows: [] });

  const getTableData = (rules: ServerRule[]): TableData<RulesTableRow> => {
    return {
      headerCells,
      rows: rules.map((rule) => ({
        checkbox: (
          <TableCheckbox
            id={rule.id}
            checked={rulesTableState.selectedIds.includes(rule.id)}
            onChange={(id) => id && dispatch(toggleSelectItem(id))}
          />
        ),
        id: rule.id,
        name: (
          <span
            onClick={() => dispatch(openUpdateRuleModal(rule))}
            className="text-white hover:underline cursor-pointer"
          >
            {rule.name}
          </span>
        ),
        conditionType: rule.condition.type,
        responseType: rule.response.type,
        probability: rule.probability ?? "100%",
      })),
    };
  };

  React.useEffect(() => {
    dispatch(updateRules());
  }, []);

  React.useEffect(() => {
    setRulesTableData(getTableData(rulesTableState.rules));
  }, [rulesTableState]);

  return (
    <Table
      tableData={rulesTableData}
      isLoading={rulesTableState.status === Status.LOADING}
    ></Table>
  );
};
